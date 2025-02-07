if [[ -f $HOME/.cargo/env ]]; then
    . "$HOME/.cargo/env"
fi
export ZDOTDIR=$HOME/.config/zsh
export XDG_CONFIG_HOME=$HOME/.config
export XDG_DATA_HOME=$HOME/.local/share
export XDG_CACHE_HOME=$HOME/.cache
if [[ -f $HOME/.zsh_secretenv ]]; then
    . "$HOME/.zsh_secretenv"
fi
