
1. Install [“Hammerspoon”](https://www.hammerspoon.org/)
2. Write a script to control VSCode Window position and size with “Hammerspoon”.
3. Open "src/lib/dynamic-wait.ts" in [“vscode-git-add-with-git-add-extension”](https://github.com/tettekete/vscode-git-add-with-git-add-extension/blob/main/src/lib/dynamic-wait.ts)
4. Open `scripts/demo/make-demo.scpt` with ScriptEditor.app
5. Run Script


## Write a script to control VSCode Window position and size with “Hammerspoon”.

`~/.hammerspoon/init.lua`

```lua
hs.urlevent.bind("resize_vscode", function()
    local vscode = hs.application.get("Code")
    if vscode then
        local win = vscode:mainWindow()

        -- `mainWindow()` が nil の場合、すべてのウィンドウから取得
        if not win then
            local windows = vscode:allWindows()
            if #windows > 0 then
                win = windows[1] -- 最初のウィンドウを取得
            end
        end

        -- ウィンドウが見つかった場合のみサイズ変更
        if win then
            win:setFrame({x = 100, y = 100, w = 640, h = 480})
        else
            hs.alert.show("VSCode window not found")
        end
    else
        hs.alert.show("Visual Studio Code (Code) is not launched.")
    end
end)
```


