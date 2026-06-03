!macro NSIS_HOOK_PREINSTALL
  DetailPrint "Stopping running HUBO sidecars..."
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-x86_64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-aarch64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar.exe'
  Pop $0
  Sleep 1000
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DetailPrint "Stopping running HUBO processes..."
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-desktop.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-x86_64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-aarch64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar.exe'
  Pop $0
  Sleep 1000
!macroend
