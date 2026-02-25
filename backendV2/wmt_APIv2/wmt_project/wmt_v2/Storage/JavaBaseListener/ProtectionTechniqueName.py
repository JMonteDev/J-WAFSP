from antlr4 import *
from wmt_v2.Instrumentacion.antlrJava.JavaLexer import JavaLexer
from wmt_v2.Instrumentacion.antlrJava.JavaParser import JavaParser
from antlr4.TokenStreamRewriter import TokenStreamRewriter

class ProtectionTechniqueName(JavaParserListener):
    def __init__(self, token_stream):
        self.rewriter = TokenStreamRewriter(token_stream)
        # Aquí debe inicializar todo lo que necesite usar posteriormente

    # def enterClassBody(self, ctx: JavaParser.ClassBodyContext): 
    #  ^^^ este de aquí arriba es un ejemplo de como debe redefinir los métodos de entrada
    #      y salida de los nodos del AP

        