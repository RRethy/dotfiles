local M = {}

local opt = vim.fn.stdpath('data') .. '/site/pack/backpack/opt/'
local manifest = vim.fn.stdpath('config') .. '/packmanifest.lua'

local wait_stack = {}
local run_stack = {}
local MAX_TASKS = 10

local function to_git_url(author, plugin)
    return string.format('https://github.com/%s/%s.git', author, plugin)
end

local function parse_url(url)
    local username, plugin = string.match(url, '^https://github.com/([^/]+)/([^/]+)$')
    if not username or not plugin then
        return
    end

    local git_url = string.format('https://github.com/%s/%s.git', username, plugin)

    return git_url, username, plugin
end

local function git_pull(name, on_success, on_complete)
    local dir = opt .. name
    local branch = vim.fn.system("git -C " .. dir .. " branch --show-current | tr -d '\n'")
    vim.loop.spawn('git', {
        args = { 'pull', 'origin', branch, '--update-shallow', '--ff-only', '--progress', '--rebase=false' },
        cwd = dir,
    }, vim.schedule_wrap(function(code)
        if code == 0 then
            on_success()
        else
            vim.notify(name .. ' pulled unsuccessfully', vim.log.levels.ERROR)
        end
        if on_complete then
            on_complete()
        end
    end))
end

local function git_clone(name, git_url, on_success, on_complete)
    vim.loop.spawn('git', {
        args = { 'clone', '--depth=1', git_url },
        cwd = opt,
    }, vim.schedule_wrap(function(code)
        if code == 0 then
            on_success()
        else
            vim.notify(name .. ' cloned unsuccessfully', vim.log.levels.ERROR)
        end
        if on_complete then
            on_complete()
        end
    end))
end

local function do_tasks()
    if #wait_stack == 0 and #run_stack == 0 then return end
    while true do
        while #wait_stack > 0 and MAX_TASKS > #run_stack do
            local data = table.remove(wait_stack)
            git_clone(
                data.plugin,
                to_git_url(data.author, data.plugin),
                function()
                    vim.cmd('packadd! ' .. data.plugin)
                end
            )
        end
        if #wait_stack == 0 and #run_stack == 0 then break end
        vim.wait(500, function() return MAX_TASKS > #run_stack end)
    end
    vim.notify("Finished backpack tasks")
end

function M.setup()
    vim.fn.mkdir(opt, 'p')

    M.plugins = {}
    local tmp = _G.use
    _G.use = function(opts)
        local _, _, author, plugin = string.find(opts[1], '^([^ /]+)/([^ /]+)$')
        table.insert(M.plugins, {
            plugin = plugin,
            author = author,
        })
        if vim.fn.isdirectory(opt .. '/' .. plugin) ~= 0 then
            vim.cmd('packadd! ' .. plugin)
        else
            table.insert(wait_stack, M.plugins[#M.plugins])
        end
    end
    if vim.fn.filereadable(manifest) ~= 0 then
        dofile(manifest)
    end
    _G.use = tmp

    -- do_tasks()

    vim.cmd [[ command! -nargs=1 PackAdd lua require('rrethy.backpack').pack_add(<f-args>) ]]
    vim.cmd [[ command! PackUpdate lua require('rrethy.backpack').pack_update() ]]
    vim.cmd [[ command! PackEdit lua require('rrethy.backpack').pack_edit() ]]

    return {}
end

function M.pack_add(url)
    local git_url, author, plugin = parse_url(url)
    if not git_url then
        return
    end

    table.insert(M.plugins, {
        plugin = plugin,
        author = author,
    })
    local on_success = function()
        vim.cmd('packadd ' .. plugin)
        vim.cmd('helptags ALL')
    end
    if vim.fn.isdirectory(opt .. plugin) ~= 0 then
        git_pull(plugin, on_success)
    else
        git_clone(plugin, git_url, on_success)
    end

    vim.fn.system(string.format('echo "use { \'%s/%s\' }" >> %s', author, plugin, manifest))
end

function M.pack_update()
    local updated = 0
    for _, data in ipairs(M.plugins) do
        local on_success = function()
            vim.cmd('packadd ' .. data.plugin)
        end
        local on_complete = function()
            updated = updated + 1
            print(string.format('Backpack: %d/%d', updated, #M.plugins))
        end
        if vim.fn.isdirectory(opt .. data.plugin) ~= 0 then
            git_pull(data.plugin, on_success, on_complete)
        else
            git_clone(data.plugin, to_git_url(data.author, data.plugin), on_success, on_complete)
        end
    end
end

function M.pack_edit()
    vim.cmd('tabnew')
    vim.cmd('edit ' .. manifest)
    local bufnr = vim.fn.bufnr()
    vim.api.nvim_create_autocmd('WinClosed', {
        buffer = bufnr,
        callback = function()
            vim.api.nvim_buf_delete(bufnr, { force = true })
        end
    })
end

return M
