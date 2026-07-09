use tauri::Manager;

#[tauri::command]
fn set_always_on_top(window: tauri::Window, always_on_top: bool) {
    let _ = window.set_always_on_top(always_on_top);
}

#[tauri::command]
fn set_window_size(window: tauri::Window, width: f64, height: f64) {
    let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize { width, height }));
}

#[tauri::command]
fn set_window_position(window: tauri::Window, x: f64, y: f64) {
    let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition { x, y }));
}

#[tauri::command]
fn get_window_position(window: tauri::Window) -> Result<(f64, f64), String> {
    match window.outer_position() {
        Ok(pos) => Ok((pos.x as f64, pos.y as f64)),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            set_always_on_top,
            set_window_size,
            set_window_position,
            get_window_position
        ])
        .setup(|app| {
            // System tray setup
            if let Some(tray) = app.tray_by_id("main") {
                tray.on_tray_icon_event(move |tray, event| {
                    if let tauri::tray::TrayIconEvent::Click { .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                });
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
