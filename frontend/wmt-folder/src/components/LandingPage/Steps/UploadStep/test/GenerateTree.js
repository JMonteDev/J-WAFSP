function generarArbolJSON(paths) {
    const root = {
      index: 0,
      id: 'root',
      label: 'Root',
      path: '/',
      children: [],
    };
  
    paths.forEach((path, index) => {
      const pathParts = path.split('/');
      let currentNode = root;
  
      pathParts.forEach((part, index2) => {
        const isLastPart = index2 === pathParts.length - 1;
        const existingNode = currentNode.children.find((node) => node.id === part);
  
        if (existingNode) {
          // Nodo ya existe, avanzamos al siguiente nivel
          currentNode = existingNode;
        } else {
          // Nodo no existe, lo creamos y avanzamos al siguiente nivel
          //let newPath = path

          const newNode = {
            index: index,
            id: part,
            label: part,
            path: isLastPart ? currentNode.path + part : currentNode.path + part + '/',
            children: [],
          };
  
          currentNode.children.push(newNode);
          currentNode = newNode;
        }
      });
    });

    console.log(root);
  
    return root;
  }
  

// Ejemplo de uso
const rutasDeCarpetas = [
    'carpeta1/subcarpeta1/archivo1.txt',
    'carpeta2/archivo3.txt',
    'carpeta3/subcarpeta3/archivo4.txt',
    'carpeta1/subcarpeta2/archivo2.txt',
];

// const arbolJSON = generarArbolJSON(rutasDeCarpetas);
// const arbolJSONString = JSON.stringify(arbolJSON, null, 2);

// console.log(arbolJSONString);

// eslint-disable-next-line import/no-anonymous-default-export
export default { generarArbolJSON };