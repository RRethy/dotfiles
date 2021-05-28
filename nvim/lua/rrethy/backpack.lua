vim.cmd('packadd plenary.nvim')
local Job = require('plenary.job')
local echo = vim.api.nvim_echo

local M = {}

local opt = vim.fn.stdpath('data')..'/site/pack/backpack/opt/'
local manifest = vim.fn.stdpath('config')..'/packmanifest.lua'

local function echo_ok(msg)
    echo({{msg, 'MoreMsg'}}, false, {})
end

local function echo_err(msg)
    echo({{msg, 'Error'}}, true, {})
end

local function echo_info(msg)
    echo({{msg, 'Normal'}}, false, {})
end

local function open_manifest(edit, close)
    local tabnr = vim.api.nvim_get_current_tabpage()
    vim.cmd('tabnew')
    vim.cmd('edit '..manifest)
    if edit then
        edit()
    end
    if close then
        vim.cmd('%!sort|uniq')
        vim.cmd('write')
        vim.cmd('bwipeout!')
        vim.api.nvim_set_current_tabpage(tabnr)
    end
end

local function parse_url(url)
    local username, plugin = string.match(url, '^https://github.com/([^/]+)/([^/]+)$')
    if not username or not plugin then
        print('ERROR: TODO')
        return
    end

    local git_url
    if username == 'RRethy' then
        git_url = string.format('git@github.com:%s/%s.git', username, plugin)
    else
        git_url = string.format('https://github.com/%s/%s.git', username, plugin)
    end

    return git_url, username, plugin
end

local function git_pull(on_success, name)
    echo_info(name..' already exists. Pulling remote')
    local dir = opt..name
    local branch = vim.fn.system("git -C "..dir.." branch --show-current | tr -d '\n'")
    Job:new({
        command = 'git',
        args = { 'pull', 'origin', branch, '--update-shallow', '--ff-only', '--progress', '--rebase=false' },
        cwd = dir,
        on_exit = vim.schedule_wrap(function(_, return_val)
            if return_val == 0 then
                echo_ok(name..' pulled successfully')
                on_success(name)
            else
                echo_err(name..' pulled unsuccessfully')
            end
        end),
    }):start()
end

local function git_clone(on_success, name, git_url)
    echo_info(name..' is being cloned')
    Job:new({
        command = 'git',
        args = { 'clone', '--depth=1', git_url },
        cwd = opt,
        on_exit = vim.schedule_wrap(function(_, return_val)
            if return_val == 0 then
                echo_ok(name..' cloned successfully')
                on_success(name)
            else
                echo_err(name..' cloned unsuccessfully')
            end
        end),
    }):start()
end

function M.setup()
    vim.fn.mkdir(opt, 'p')

    M.plugins = {}
    _G.use = function(opts)
        local _, _, author, plugin = string.find(opts[1], '^([^ /]+)/([^ /]+)$')
        table.insert(M.plugins, {
            plugin = plugin,
            author = author,
        })
        if vim.fn.isdirectory(opt..'/'..plugin) ~= 0 then
            vim.cmd('packadd! '..plugin)
        end
    end
    if vim.fn.filereadable(manifest) ~= 0 then
        dofile(manifest)
    end
    _G.use = nil

    vim.cmd [[ command! -nargs=1 PackAdd lua require('rrethy.backpack').pack_add(<f-args>) ]]
    vim.cmd [[ command! PackUpdate lua require('rrethy.backpack').pack_update() ]]
    vim.cmd [[ command! PackEdit lua require('rrethy.backpack').pack_edit() ]]
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
        vim.cmd('packadd '..plugin)
    end
    if vim.fn.isdirectory(opt..plugin) ~= 0 then
        git_pull(on_success, plugin)
    else
        git_clone(on_success, plugin, git_clone)
    end

    open_manifest(function()
        vim.fn.append(vim.fn.line('$'), string.format('use { name = %s }', plugin))
    end, true)
end

function M.pack_update()
    local on_success = function(plugin)
        vim.cmd('packadd '..plugin)
    end
    for _, data in ipairs(M.plugins) do
        if vim.fn.isdirectory(opt..data.plugin) ~= 0 then
            git_pull(on_success, data.plugin)
        else
            git_clone(on_success, data.plugin, git_clone)
        end
    end
end

function M.pack_edit()
    open_manifest()
end

return M
