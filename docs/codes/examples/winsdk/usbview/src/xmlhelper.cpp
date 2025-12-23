#using <System.dll>
#using <System.Xml.dll>

using namespace System;
using namespace System::Xml;

public ref class XmlHelper {
public:
    static void Parse(String^ path) {
        XmlDocument^ doc = gcnew XmlDocument();
        doc->Load(path);
        Console::WriteLine(doc->OuterXml);
    }
};
