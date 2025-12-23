/* File : example.i */
%module example

%{
#include "example.c"
%}

/* Let's just grab the original header file here */
int fact(int n);
int my_mod(int x, int y);
extern double My_variable;
