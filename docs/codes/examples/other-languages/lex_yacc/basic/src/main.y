%{
#include <stdio.h>
int yylex();
void yyerror(const char *s);
%}

%token NUMBER NEWLINE CHARACTER

%%
lines:  /* empty */
        | lines line
        ;

line:   NEWLINE
        | NUMBER NEWLINE { printf("Number: %d\n", $1); }
        | CHARACTER NEWLINE { printf("Character: %c\n", $1); }
        ;
%%

void yyerror(const char *s) {
    fprintf(stderr, "%s\n", s);
}

int main(void) {
    yyparse();
    return 0;
}
