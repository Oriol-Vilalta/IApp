## Instalación Backend (Flask)

Para poner en marcha el backend, asegúrate de tener **Python 3.10** y **pip** instalados.

### Pasos:
1. Entra al directorio `./backend`
2. Crea un entorno virtual (recomendado):
   - Con `venv`:  
     ```
     python -m venv venv  
     .\venv\Scripts\Activate.ps1
     ```
   - Con `conda`:  
     ```
     conda create --name myenv python=3.10  
     conda activate myenv
     ```
3. Instala las dependencias del proyecto:  
   ```
   pip install -r requirements.txt
   ```
4. Ejecuta el servidor de desarrollo:  
   ```
   flask run
   ```

---

## Instalación Frontend (React + Vite)

Para que funcione el frontend, necesitas **Node.js** y **npm**.

### Pasos:
1. Entra al directorio `./frontend`
2. Instala las dependencias del proyecto:  
   ```
   npm install
   ```
3. Genera la build para producción:  
   ```
   npm run build
   ```
4. Sirve los archivos generados con un servidor estático:  
   ```
   npm install -g serve  
   serve -s dist
   ```

Este proceso te permitirá ejecutar tanto el backend como el frontend de forma local para desarrollo o producción.
