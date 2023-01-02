#! /bin/sh

wget https://github.com/bufbuild/buf/releases/download/v1.11.0/buf-Linux-x86_64
mv buf-Linux-x86_64 buf
chmod +x buf
mkdir -p "$HOME/bin"
mv buf "$HOME/bin"

mkdir -p "$HOME/.config"

# git setup
mkdir -p "$HOME/.config/git/bin"
ln -sf "$HOME/dotfiles/git/config"           "$HOME/.config/git/config"
ln -sf "$HOME/dotfiles/git/gitignore_global" "$HOME/.config/git/gitignore_global"
ln -sf "$HOME/dotfiles/git/bin/git-jump"     "$HOME/.config/git/bin/git-jump"

# neovim setup
ln -sf "$HOME/dotfiles/nvim" "$HOME/.config/nvim"

# zshrc setup
mkdir -p "$HOME/.config/zsh"
ln -sf "$HOME/dotfiles/zsh/.zshenv"      "$HOME/.zshenv"
ln -sf "$HOME/dotfiles/zsh/.zshrc"       "$HOME/.config/zsh/.zshrc"
ln -sf "$HOME/dotfiles/zsh/gitprompt.sh" "$HOME/.config/zsh/gitprompt.sh"

# specify the colours I use
ln -sf "$HOME/dotfiles/.base16_theme" "$HOME/.config/.base16_theme"

# https://sw.kovidgoyal.net/kitty/faq/#i-get-errors-about-the-terminal-being-unknown-or-opening-the-terminal-failing-when-sshing-into-a-different-computer
tic -x -o \~/.terminfo ~/dotfiles/kitty/infocmp.txt

sudo apt-get install -y fzy
sudo apt-get install -y fzf
sudo apt-get install -y ripgrep
# sudo apt-get install fd-find

# install Neovim
sudo apt purge neovim
sudo add-apt-repository -y ppa:neovim-ppa/unstable
sudo apt update
sudo apt install -y neovim

nvim -c "PackUpdate"
cd "$XDG_DATA_HOME/nvim/site/pack/backpack/opt/telescope-fzy-native.nvim/"
git submodule update
git submodule init
cd "$XDG_DATA_HOME/nvim/site/pack/backpack/opt/telescope-fzy-native.nvim/"
make
sudo rm -rf /usr/local/lib/nvim/parser
sudo rm -rf /usr/local/share/nvim/runtime/queries

# OSX specific setup
# if [[ $OSTYPE == "darwin"* ]]; then
#     # increase key repeat speed, needs restart to take effect
#     defaults write -g KeyRepeat -int 1
#     defaults write -g InitialKeyRepeat -int 10
#
#     # setup hammerspoon (OSX only)
#     ln -sf ~/.config/.hammerspoon ~/.hammerspoon
#
#     # install some CLIs I use
#     brew install fzy
#     brew install fzf
#     brew install ripgrep
#     brew install fd
#
#     # install Neovim
#     brew install --HEAD neovim
#     brew link --overwrite neovim
# fi

# Spin specific setup
# if [[ $SPIN ]]; then
#     # install some CLIs I use
#     sudo apt-get install -y fzy
#     sudo apt-get install -y fzf
#     sudo apt-get install -y ripgrep
#     sudo apt-get install fd-find
#
#     # install Neovim
#     # sudo apt purge neovim
#     # sudo add-apt-repository -y ppa:neovim-ppa/unstable
#     # sudo apt update
#     # sudo apt install -y neovim
# fi

# backpack.nvim will block and install any missing plugins and block the UI
# thread when Neovim is opened. So to install Neovim plugins we just open and
# close it immediately.
# BACKPACK_NO_SSH=1 nvim -c "q"
