import os
from antlr4 import *
from wmt_v2.Instrumentacion.antlrJava.JavaLexer import JavaLexer
from wmt_v2.Instrumentacion.antlrJava.JavaParser import JavaParser
from wmt_v2.Instrumentacion.antlrJava.JavaErrorListener import JavaErrorListener

GRAMMAR_PATH_FOLDER = 'GrammarsAntlrv4\\grammarsV4'

def handle_uploaded_file(f, path):
    with open(path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
        destination.close()

def buildFoldersTree(files, paths, folderDestination):
    a = 1
    for path in paths.values():
        #separo las carpetas por las barras para sacar el fileName del path
        splittedFolders = path.split("/")
        #y lo vuelvo a mergear para que quede el path
        folders = "/".join(splittedFolders[0:-1]) 

        if folders != "":
            #ahora intento crearlo
            os.makedirs("wmt_APIv2/wmt_project/wmt_v2/Storage/" + folderDestination + "/" + folders, exist_ok=True)
            
        handle_uploaded_file(files['file' + str(a)], "wmt_APIv2/wmt_project/wmt_v2/Storage/" + folderDestination + "/" + path)
        a+=1



def instrumentar(files, paths, primitiveImport, primitiveClassName, folderDestination):
    errors = []
    buildFoldersTree(files, paths, folderDestination)


    for path in paths.values():
        rewriter = ""
        
        if path.endswith(".java"):
            input_stream = FileStream("wmt_APIv2/wmt_project/wmt_v2/Storage/" + folderDestination + "/" + path, encoding='utf-8')  #REALIZO EL PROCESO DE OBTENER LOS TOKENS Y GENERAR EL ARBOL DE PARSE PARA LUEGO RECORRERLO CON EL LISTENER
            lexer = JavaLexer(input_stream)
            lexer.removeErrorListeners()

            stream = CommonTokenStream(lexer)
            parser = JavaParser(stream)

            error_listener = JavaErrorListener()    # 1
            parser.removeErrorListeners()           # 3
            parser.addErrorListener(error_listener) # 4

            tree = parser.compilationUnit()

            if (error_listener.errors != []):
                errors.append({
                    "path": path,
                    "errors": error_listener.errors
                })
                error_listener.errors = []  # Limpiar errores después de procesar el archivo
            else:
                eval(primitiveImport)
                printer = eval(primitiveClassName)       #EL LISTENER

                walker = ParseTreeWalker()
                walker.walk(printer, tree) 
                
                rewriter = printer.rewriter.getText("default", 0, 900000) 

                f = open ("wmt_APIv2/wmt_project/wmt_v2/Storage/" + folderDestination + "/" + path,'w')
                # hay que ir creando las carpetas si no existen
                # cuando termine todo hay que limpiar la carpeta
                f.write(rewriter)
                f.close()

    return errors


