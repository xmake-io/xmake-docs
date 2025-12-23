program main;

function add(a, b: Integer): Integer; cdecl; external 'foo';

begin
  Writeln('add(1, 1) = ', add(1, 1));
end.
