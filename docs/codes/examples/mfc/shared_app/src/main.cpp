#include "main.h"

CMyApp theApp;

BOOL CMyApp::InitInstance() {
    m_pMainWnd = new CMyFrame();
    m_pMainWnd->ShowWindow(m_nCmdShow);
    m_pMainWnd->UpdateWindow();
    return TRUE;
}

CMyFrame::CMyFrame() {
    Create(NULL, _T("MFC Shared App"));
}
