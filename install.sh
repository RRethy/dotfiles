#! /bin/sh

function echo_red {
    echo "\033[31m$1\033[0m"
}

function echo_green {
    echo "\033[32m$1\033[0m"
}

function info {
    echo "\033[34m$1\033[0m"
}

info "Cloning dotfiles from https://github.com/RRethy/dotfiles into ~/.config/"

# clone my dotfiles
mv ~/.config ~/.old_config
git clone git@github.com:RRethy/dotfiles.git ~/.config

# install my neovim plugins
# TODO

defaults write -g InitialKeyRepeat -int 10
defaults write -g KeyRepeat -int 1
