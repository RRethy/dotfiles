#!/bin/bash

which -s brew

if [[ $? -ne 0 ]] ; then
   /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
   brew update
fi

# zsh
# oh-my-zsh
# powerlevel9k
# coreutils
# autojump
# w3m
# ranger
# fzf
# neovim
# chsh for zsh
# zymlink zshrc
# keyrepeat speed
# symlink git stuff
# symlink tmux or figure out if I don't need to
# install neovim plugins `nvim -u NORCC -c "SixpackReadManifest"`
