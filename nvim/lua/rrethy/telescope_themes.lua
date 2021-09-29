local themes = {}
-- TODO(RRethy): Fix this

function themes.get_dropdown(opts)
  opts = opts or {}

  local theme_opts = {
    -- WIP: Decide on keeping these names or not.
    theme = "dropdown",

    sorting_strategy = "ascending",
    layout_strategy = "center",
    results_title = false,
    preview_title = "Preview",
    preview_cutoff = 1, -- Preview should always show (unless previewer = false)
    width = 80,
    results_height = 15,
    borderchars = {
      { '─', '│', '─', '│', '╭', '╮', '╯', '╰'},
      prompt = {"─", "│", " ", "│", "╭", "╮", "│", "│"},
      results = {"─", "│", "─", "│", "├", "┤", "╯", "╰"},
      preview = { '─', '│', '─', '│', '╭', '╮', '╯', '╰'},
    },
  }

  return vim.tbl_deep_extend("force", theme_opts, opts)
end

function themes.get_dynamic_dropdown(opts)
  opts = opts or {}

  local theme_opts = {
    theme = "dynamic_dropdown",

    sorting_strategy = "ascending",
    layout_strategy = "center",
    results_title = false,
    preview_title = "Preview",
    preview_cutoff = 1,
    width = 80,
    results_height = 15,
    borderchars = {
      { '─', '│', '─', '│', '╭', '╮', '╯', '╰'},
      prompt = {"─", "│", " ", "│", "╭", "╮", "│", "│"},
      results = {"─", "│", "─", "│", "├", "┤", "╯", "╰"},
      preview = { '─', '│', '─', '│', '╭', '╮', '╯', '╰'},
    },
  }

  return vim.tbl_deep_extend("force", theme_opts, opts)
end

return themes
