#!/bin/sh

mkdir ~/.config
ln -sf ~/dotfiles/bin ~/.config/bin
ln -sf ~/dotfiles/git ~/.config/git
ln -sf ~/dotfiles/git-chain ~/.config/git-chain
ln -sf ~/dotfiles/nvim ~/.config/nvim
ln -sf ~/dotfiles/tagrity ~/.config/tagrity
ln -sf ~/dotfiles/zsh ~/.config/zsh
ln -sf ~/dotfiles/zsh/.zshrc ~/.zshrc
ln -sf ~/dotfiles/.base16_theme ~/.config/.base16_theme

if [[ "$OSTYPE" == "darwin"* ]]; then
    defaults write -g KeyRepeat -int 1
    defaults write -g InitialKeyRepeat -int 10
    ln -s ~/.config/.hammerspoon ~
fi
