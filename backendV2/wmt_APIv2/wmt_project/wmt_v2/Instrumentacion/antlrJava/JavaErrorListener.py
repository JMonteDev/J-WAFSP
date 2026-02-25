from antlr4 import *
from antlr4.error.ErrorListener import ErrorListener

class JavaErrorListener(ErrorListener):
    def __init__(self):
        super().__init__()
        self.errors = []  

    def syntaxError(self, recognizer, offendingSymbol, line, column, msg, e):
        self.errors.append({
            "line": line,
            "column": column,
            "msg": msg,
            "offending_symbol": offendingSymbol.text if offendingSymbol else None
        })




