hs.loadSpoon("ReloadConfiguration")
spoon.ReloadConfiguration:start()

hs.loadSpoon("AllBrightness")
spoon.AllBrightness:start()

hs.loadSpoon("KSheet")
spoon.KSheet:init()
hs.hotkey.bind({"alt", "ctrl"}, "1", function()
    spoon.KSheet:toggle()
end)

hs.loadSpoon("Emojis")
spoon.Emojis:bindHotkeys({toggle = {{"alt", "ctrl"}, "e"}})

hs.hotkey.bind({"alt", "ctrl"}, "v", function()
    hs.eventtap.keyStrokes(hs.pasteboard.getContents())
end)

function resizeWindow(setSizes)
    local win = hs.window.focusedWindow()
    local f = win:frame()
    local screen = win:screen()
    local max = screen:frame()
    setSizes(f, max)
    hs.window.animationDuration = 0
    win:setFrame(f)
end

hs.hotkey.bind({"alt", "ctrl"}, "h", function()
    resizeWindow(function (f, max)
        f.x = max.x
        f.y = max.y
        f.w = max.w / 2
        f.h = max.h
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "l", function()
    resizeWindow(function (f, max)
        f.x = max.x + (max.w / 2)
        f.y = max.y
        f.w = max.w / 2
        f.h = max.h
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "k", function()
    resizeWindow(function (f, max)
        f.x = max.x
        f.y = max.y
        f.w = max.w
        f.h = max.h / 2
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "j", function()
    resizeWindow(function (f, max)
        f.w = max.w
        f.h = max.h / 2
        f.x = max.x
        f.y = max.y + f.h
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "u", function()
    resizeWindow(function (f, max)
        f.x = max.x
        f.y = max.y
        f.w = max.w / 2
        f.h = max.h / 2
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "i", function()
    resizeWindow(function (f, max)
        f.w = max.w / 2
        f.h = max.h / 2
        f.x = max.x + f.w
        f.y = max.y
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "n", function()
    resizeWindow(function (f, max)
        f.w = max.w / 2
        f.h = max.h / 2
        f.x = max.x
        f.y = max.y + f.h
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "m", function()
    resizeWindow(function (f, max)
        f.w = max.w / 2
        f.h = max.h / 2
        f.x = max.x + f.w
        f.y = max.y + f.h
    end)
end)

hs.hotkey.bind({"alt", "ctrl"}, "return", function()
    resizeWindow(function (f, max)
        f.x = max.x
        f.y = max.y
        f.w = max.w
        f.h = max.h
    end)
end)
