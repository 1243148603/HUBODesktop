!macro NSIS_HOOK_PREINSTALL
<<<<<<< HEAD
  DetailPrint "Stopping running HUBO sidecars..."
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-x86_64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-aarch64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar.exe'
=======
  DetailPrint "Stopping running Claude Code Haha sidecars..."
  nsExec::ExecToLog 'taskkill /F /T /IM claude-sidecar-x86_64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM claude-sidecar-aarch64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM claude-sidecar.exe'
>>>>>>> upstream/main
  Pop $0
  Sleep 1000
!macroend

!macro NSIS_HOOK_PREUNINSTALL
<<<<<<< HEAD
  DetailPrint "Stopping running HUBO processes..."
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-desktop.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-x86_64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar-aarch64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM hubo-sidecar.exe'
=======
  DetailPrint "Stopping running Claude Code Haha processes..."
  nsExec::ExecToLog 'taskkill /F /T /IM claude-code-desktop.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM claude-sidecar-x86_64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM claude-sidecar-aarch64-pc-windows-msvc.exe'
  Pop $0
  nsExec::ExecToLog 'taskkill /F /T /IM claude-sidecar.exe'
>>>>>>> upstream/main
  Pop $0
  Sleep 1000
!macroend
