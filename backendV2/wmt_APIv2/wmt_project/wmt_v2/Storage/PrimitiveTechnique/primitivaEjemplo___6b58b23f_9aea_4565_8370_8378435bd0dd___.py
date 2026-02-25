from antlr4 import *
from wmt_v2.Instrumentacion.antlrJava.JavaLexer import JavaLexer
from wmt_v2.Instrumentacion.antlrJava.JavaParser import JavaParser
from wmt_v2.Instrumentacion.antlrJava.JavaParserListener import JavaParserListener
from antlr4.TokenStreamRewriter import TokenStreamRewriter
import uuid

# class WaterMarkTechnique(JavaParserListener):
#     def __init__(self, token_stream):
#         self.rewriter = TokenStreamRewriter(token_stream)
#         self.watermark_id = f"WMT_{uuid.uuid4().hex[:12].upper()}"  # ID único de 12 caracteres
#         self.added_to_current_class = False

#     def enterClassBody(self, ctx: JavaParser.ClassBodyContext):
#         # Insertar solo una vez por clase
#         if not self.added_to_current_class:
#             watermark_code = f"\n\t// :: WATERMARK :: \n\tprivate static final String WMT_ID = \"{self.watermark_id}\";\n"
            
#             # Insertar después de la llave de apertura '{' de la clase
#             self.rewriter.insertAfter(ctx.start, watermark_code)
#             self.added_to_current_class = True

#     def exitClassDeclaration(self, ctx: JavaParser.ClassDeclarationContext):
#         # Resetear flag para la próxima clase
#         self.added_to_current_class = False 

class WaterMarkTechnique(JavaParserListener):
    def __init__(self, token_stream):
        self.rewriter = TokenStreamRewriter(token_stream)
        self.watermark_id = f"WMT_{uuid.uuid4().hex[:12].upper()}"
        self.added_to_current_class = False

    def enterClassBody(self, ctx: JavaParser.ClassBodyContext):
        if not self.added_to_current_class:
            watermark_code = f"\n\t// :: WATERMARK :: \n\tprivate static final String WMT_ID = \"{self.watermark_id}\";\n"
            # Usar tokenIndex en lugar del token directamente
            self.rewriter.insertAfter(ctx.start.tokenIndex, watermark_code)
            self.added_to_current_class = True

    def exitClassDeclaration(self, ctx: JavaParser.ClassDeclarationContext):
        self.added_to_current_class = False


        