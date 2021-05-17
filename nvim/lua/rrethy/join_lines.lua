local M = {}

local function get_params()
    local params = vim.lsp.util.make_range_params()
    params.ranges = {params.range} -- Range[] is used to support multicursors
    return params
end

function M.join_lines()
    vim.lsp.buf_request(0, "experimental/joinLines", get_params(), M.handler)
end

function M.handler(_, _, result, _, bufnr, _)
    vim.lsp.util.apply_text_edits(result, bufnr)
end

return M
