%{
#include <stdio.h>
#include "xmake.tab.h"
%}

%%
[0-9]+  return NUMBER;
\n      return NEWLINE;
.       return CHARACTER;
%%
