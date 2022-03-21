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
ln -sf ~/dotfiles/zsh/.zshrc ~/.config/zsh/.zshrc
ln -sf ~/dotfiles/zsh/gitprompt.sh ~/.config/zsh/gitprompt.sh

# specify the colours I use
ln -sf ~/dotfiles/.base16_theme ~/.config/.base16_theme

# https://sw.kovidgoyal.net/kitty/faq/#i-get-errors-about-the-terminal-being-unknown-or-opening-the-terminal-failing-when-sshing-into-a-different-computer
tic -x -o \~/.terminfo ~/dotfiles/kitty/infocmp.txt

# install rust
curl https://sh.rustup.rs -sSf | sh -s -- -y

# install some of my own command line tools
# cargo install --git https://github.com/RRethy/rwc
# cargo install --git https://github.com/RRethy/tcount.git

# OSX specific setup
if [[ $OSTYPE == "darwin"* ]]; then
    # increase key repeat speed, needs restart to take effect
    defaults write -g KeyRepeat -int 1
    defaults write -g InitialKeyRepeat -int 10

    # setup hammerspoon (OSX only)
    ln -sf ~/.config/.hammerspoon ~/.hammerspoon

    # install some CLIs I use
    brew install fzy
    brew install fzf
    brew install ripgrep
    brew install fd

    # install Neovim
    brew install --HEAD neovim
    brew link --overwrite neovim
fi

# Spin specific setup
if [[ $SPIN ]]; then
    # install some CLIs I use
    sudo apt-get install -y fzy
    sudo apt-get install -y fzf
    sudo apt-get install -y ripgrep
    sudo apt-get install fd-find

    # install Neovim
    # sudo apt purge neovim
    # sudo add-apt-repository -y ppa:neovim-ppa/unstable
    # sudo apt update
    # sudo apt install -y neovim
fi

# backpack.nvim will block and install any missing plugins and block the UI
# thread when Neovim is opened. So to install Neovim plugins we just open and
# close it immediately.
# BACKPACK_NO_SSH=1 nvim -c "q"
