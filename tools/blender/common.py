"""Funzioni condivise dagli script Blender del progetto.

Uso: blender -b -P tools/blender/<script>.py
La geometria viene accumulata in un bmesh per materiale: nel file .glb ogni
materiale diventa un solo oggetto, con nome stabile `part_<materiale>`, così il
sito può cambiarne colore e finitura senza conoscere la geometria.
"""
import math
import os

import bmesh
import bpy
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")


def srgb(hex_color):
    """'#rrggbb' -> terna lineare, come la vuole Blender."""
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return tuple(out)


class Builder:
    def __init__(self):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        self.meshes = {}      # nome materiale -> bmesh
        self.materials = {}   # nome materiale -> bpy material
        self.groups = {}      # nome oggetto -> nome materiale (per oggetti separati)

    # ---- materiali -------------------------------------------------------
    def material(self, name, color, rough=0.5, metal=0.0, emit=0.0, alpha=1.0):
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        rgb = srgb(color)
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = (*rgb, 1)
        b.inputs["Roughness"].default_value = rough
        b.inputs["Metallic"].default_value = metal
        b.inputs["Alpha"].default_value = alpha
        if emit:
            b.inputs["Emission Color"].default_value = (*rgb, 1)
            b.inputs["Emission Strength"].default_value = emit
        if alpha < 1:
            try:
                m.surface_render_method = "BLENDED"
            except AttributeError:
                m.blend_method = "BLEND"
        m.diffuse_color = (*rgb, alpha)
        m.roughness = rough
        m.metallic = metal
        self.materials[name] = m
        return m

    def _bm(self, part):
        """`part` è 'materiale' oppure 'oggetto:materiale' per tenere un pezzo separato."""
        if part not in self.meshes:
            self.meshes[part] = bmesh.new()
        return self.meshes[part]

    # ---- primitive -------------------------------------------------------
    def box(self, part, x0, x1, y0, y1, z0, z1, bevel=0.0):
        bm = self._bm(part)
        size = Vector((x1 - x0, y1 - y0, z1 - z0))
        center = Vector(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
        m = Matrix.Translation(center) @ Matrix.Diagonal((*size, 1))
        verts = bmesh.ops.create_cube(bm, size=1.0, matrix=m)["verts"]
        if bevel:
            edges = list({e for v in verts for e in v.link_edges})
            bmesh.ops.bevel(bm, geom=edges, offset=bevel, segments=1, affect="EDGES", profile=0.5)

    def cyl(self, part, x, y, z0, z1, r, segments=16, r_top=None):
        bm = self._bm(part)
        m = Matrix.Translation((x, y, (z0 + z1) / 2))
        bmesh.ops.create_cone(bm, cap_ends=True, segments=segments, radius1=r,
                              radius2=r if r_top is None else r_top, depth=z1 - z0, matrix=m)

    def raw(self, part):
        """Accesso diretto al bmesh, per forme non a scatola."""
        return self._bm(part)

    # ---- chiusura --------------------------------------------------------
    def finish(self):
        for part, bm in self.meshes.items():
            obj_name, _, mat_name = part.rpartition(":")
            mat_name = mat_name or part
            obj_name = obj_name or f"part_{mat_name}"
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
            uv = bm.loops.layers.uv.new("UVMap")
            for f in bm.faces:           # proiezione a scatola, 1 unità UV = 1 metro
                n = f.normal
                ax = max(range(3), key=lambda i: abs(n[i]))
                for loop in f.loops:
                    c = loop.vert.co
                    loop[uv].uv = {0: (c.y, c.z), 1: (c.x, c.z), 2: (c.x, c.y)}[ax]
            me = bpy.data.meshes.new(obj_name)
            bm.to_mesh(me)
            bm.free()
            me.materials.append(self.materials[mat_name])
            ob = bpy.data.objects.new(obj_name, me)
            bpy.context.scene.collection.objects.link(ob)
        self.meshes = {}

    def preview(self, name, location, target, lens=35, size=(960, 600)):
        """Anteprima veloce (Workbench): serve solo a controllare la geometria."""
        sc = bpy.context.scene
        cam_data = bpy.data.cameras.new("cam")
        cam_data.lens = lens
        cam = bpy.data.objects.new("cam_" + name, cam_data)
        sc.collection.objects.link(cam)
        cam.location = location
        cam.rotation_euler = (Vector(target) - Vector(location)).to_track_quat("-Z", "Y").to_euler()
        sc.camera = cam
        sc.render.engine = "BLENDER_WORKBENCH"
        sh = sc.display.shading
        sh.light = "STUDIO"
        sh.color_type = "MATERIAL"
        sh.show_cavity = True
        sh.show_shadows = False
        sc.view_settings.view_transform = "Standard"
        if sc.world is None:
            sc.world = bpy.data.worlds.new("world")
        wall = self.materials.get("wall")       # sfondo dello stesso colore della parete, se c'è
        sc.world.color = tuple(wall.diffuse_color[:3]) if wall else (0.55, 0.5, 0.45)
        sc.display.render_aa = "8"
        sc.render.resolution_x, sc.render.resolution_y = size
        sc.render.film_transparent = False
        os.makedirs(OUT, exist_ok=True)
        sc.render.filepath = os.path.join(OUT, name + ".png")
        bpy.ops.render.render(write_still=True)
        bpy.data.objects.remove(cam)

    def export(self, name):
        os.makedirs(OUT, exist_ok=True)
        path = os.path.join(OUT, name + ".glb")
        bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", export_apply=True,
                                  export_yup=True, export_cameras=False, export_lights=False)
        tris = sum(len(o.data.loop_triangles) or (o.data.calc_loop_triangles() or len(o.data.loop_triangles))
                   for o in bpy.data.objects if o.type == "MESH")
        print(f"EXPORT {path}  {os.path.getsize(path) / 1024:.0f} KB  {tris} triangoli  "
              f"{sum(o.type == 'MESH' for o in bpy.data.objects)} oggetti")
        return path
