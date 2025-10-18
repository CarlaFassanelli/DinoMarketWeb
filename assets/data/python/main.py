import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog
import json
import os

class ProductoCRUDApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CRUD de Productos")
        self.json_path = None
        self.productos = []
        self.selected_index = None

        # Interfaz
        self.frame_top = tk.Frame(root)
        self.frame_top.pack(pady=10)
        self.btn_select = tk.Button(self.frame_top, text="Seleccionar archivo JSON", command=self.seleccionar_json)
        self.btn_select.pack(side=tk.LEFT, padx=5)
        self.lbl_path = tk.Label(self.frame_top, text="No se ha seleccionado archivo")
        self.lbl_path.pack(side=tk.LEFT, padx=5)

        self.listbox = tk.Listbox(root, width=80)
        self.listbox.pack(pady=10)
        self.listbox.bind('<<ListboxSelect>>', self.on_select)

        self.frame_btns = tk.Frame(root)
        self.frame_btns.pack(pady=5)
        self.btn_add = tk.Button(self.frame_btns, text="Agregar", command=self.agregar_producto)
        self.btn_add.pack(side=tk.LEFT, padx=5)
        self.btn_edit = tk.Button(self.frame_btns, text="Editar", command=self.editar_producto)
        self.btn_edit.pack(side=tk.LEFT, padx=5)
        self.btn_delete = tk.Button(self.frame_btns, text="Eliminar", command=self.eliminar_producto)
        self.btn_delete.pack(side=tk.LEFT, padx=5)

    def seleccionar_json(self):
        path = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if path:
            self.json_path = path
            self.lbl_path.config(text=os.path.basename(path))
            self.cargar_productos()

    def cargar_productos(self):
        try:
            with open(self.json_path, 'r', encoding='utf-8') as f:
                self.productos = json.load(f)
            self.actualizar_listbox()
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo cargar el archivo:\n{e}")

    def guardar_productos(self):
        if self.json_path:
            try:
                with open(self.json_path, 'w', encoding='utf-8') as f:
                    json.dump(self.productos, f, indent=4, ensure_ascii=False)
            except Exception as e:
                messagebox.showerror("Error", f"No se pudo guardar el archivo:\n{e}")

    def actualizar_listbox(self):
        self.listbox.delete(0, tk.END)
        for prod in self.productos:
            self.listbox.insert(tk.END, f"{prod['id']}: {prod['nombre']} - {prod['categoria']} (${prod['precio']})")

    def on_select(self, event):
        sel = self.listbox.curselection()
        self.selected_index = sel[0] if sel else None

    def agregar_producto(self):
        if not self.json_path:
            messagebox.showwarning("Advertencia", "Seleccione primero un archivo JSON.")
            return
        prod = self.pedir_datos_producto()
        if prod:
            prod['id'] = self.obtener_nuevo_id()
            self.productos.append(prod)
            self.guardar_productos()
            self.actualizar_listbox()

    def editar_producto(self):
        if self.selected_index is None:
            messagebox.showwarning("Advertencia", "Seleccione un producto para editar.")
            return
        prod = self.productos[self.selected_index]
        nuevos_datos = self.pedir_datos_producto(prod)
        if nuevos_datos:
            nuevos_datos['id'] = prod['id']
            self.productos[self.selected_index] = nuevos_datos
            self.guardar_productos()
            self.actualizar_listbox()

    def eliminar_producto(self):
        if self.selected_index is None:
            messagebox.showwarning("Advertencia", "Seleccione un producto para eliminar.")
            return
        if messagebox.askyesno("Confirmar", "¿Está seguro de eliminar este producto?"):
            del self.productos[self.selected_index]
            self.guardar_productos()
            self.actualizar_listbox()
            self.selected_index = None

    def pedir_datos_producto(self, prod=None):
        campos = [
            ("nombre", "Nombre"),
            ("img", "Ruta de imagen"),
            ("descripcion", "Descripción"),
            ("precio", "Precio"),
            ("stock", "Stock"),
            ("categoria", "Categoría")
        ]
        datos = {}
        for key, label in campos:
            valor_inicial = prod[key] if prod else ""
            valor = simpledialog.askstring("Dato de producto", f"{label}:", initialvalue=str(valor_inicial))
            if valor is None:
                return None  # Cancelado
            if key in ("precio", "stock"):
                try:
                    valor = float(valor) if key == "precio" else int(valor)
                except ValueError:
                    messagebox.showerror("Error", f"{label} debe ser un número.")
                    return None
            datos[key] = valor
        return datos

    def obtener_nuevo_id(self):
        if not self.productos:
            return 1
        return max(prod['id'] for prod in self.productos) + 1

if __name__ == "__main__":
    root = tk.Tk()
    app = ProductoCRUDApp(root)
    root.mainloop()