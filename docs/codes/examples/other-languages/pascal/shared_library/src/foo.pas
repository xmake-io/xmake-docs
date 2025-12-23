library foo;

function add(a, b: Integer): Integer; cdecl; export;
begin
  add := a + b;
end;

exports
  add;

begin
end.
