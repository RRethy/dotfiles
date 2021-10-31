#! /bin/sh

mkdir -p ~/.config

# git setup
mkdir -p ~/.config/git/bin
ln -sf ~/dotfiles/git/config ~/.config/git/config
ln -sf ~/dotfiles/git/gitignore_global ~/.config/git/gitignore_global
ln -sf ~/dotfiles/git/bin/git-jump ~/.config/git/bin/git-jump

# neovim setup
ln -sf ~/dotfiles/nvim ~/.config/nvim

# tagrity setup
ln -sf ~/dotfiles/tagrity ~/.config/tagrity

# zshrc setup
mkdir -p ~/.config/zsh
ln -sf ~/dotfiles/zsh/.zshenv ~/.zshenv
ln -sf ~/dotfiles/zsh/.zshrc ~/.zshrc
ln -sf ~/dotfiles/zsh/gitprompt.sh ~/.config/zsh/gitprompt.sh

# specify the colours I use
ln -sf ~/dotfiles/.base16_theme ~/.config/.base16_theme

# https://sw.kovidgoyal.net/kitty/faq/#i-get-errors-about-the-terminal-being-unknown-or-opening-the-terminal-failing-when-sshing-into-a-different-computer
tic -x -o \~/.terminfo ~/dotfiles/kitty/infocmp.txt

# OSX specific setup
if [[ $OSTYPE == "darwin"* ]]; then
   defaults write -g KeyRepeat -int 1
   defaults write -g InitialKeyRepeat -int 10
   ln -sf ~/.config/.hammerspoon ~/.hammerspoon
fi
#
#if [[ $SPIN ]]; then
#    ln -sf ~/dotfiles/spin/zsh/.zshrc ~/.zshrc
#    sudo apt-get install -y fzy
#    sudo apt-get install -y fzf
#    sudo apt-get install -y ripgrep
#fi
