#!/bin/bash

# Some utils functions {{{
onInstallStarted() {
  echo "[Installing $1] Status: Started"
}

onInstallFinished() {
  echo "[Installing $1] Status: Finished!"
}

onConfigSourced() {
  echo "[Sourcing $1] Status: Finished!"
}
#}}}

# Install Brew {{{
onInstallStarted Brew

which -s brew

if [[ $? != 0 ]] ; then
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  brew update
fi

onInstallFinished Brew
#}}}

# Install zsh {{{
onInstallStarted zsh

which -s zsh

if [[ $? != 0 ]] ; then
  brew install zsh
else
  brew upgrade zsh
fi

sudo -s 'echo /usr/local/bin/zsh >> /etc/shells' && chsh -s /usr/local/bin/zsh

onInstallFinished zsh
#}}}

# Install oh-my-zsh {{{
onInstallStarted oh-my-zsh

sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

onInstallFinished oh-my-zsh
#}}}

# Install powerlevel9k (oh-my-zsh theme) {{{
onInstallStarted powerlevel9k

git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k

onInstallFinished powerlevel9k
#}}}

# Install coreutils {{{
onInstallStarted "coreutils for gshuf"

which -s gshuf

if [[ $? != 0 ]] ; then
  brew install coreutils
else
  brew upgrade coreutils
fi

onInstallFinished "coreutils for gshuf"
#}}}

# Setup zsh {{{
echo "source ~/.config/zsh/rrethy.zsh" >> ~/.zshrc

onConfigSourced zsh
#}}}

# Setup ideavim {{{
echo "source ~/.config/ideavimrc.vim" >> ~/.ideavimrc

onConfigSourced ideavimrc
#}}}

# Setup gitconfig {{{
echo "[include]" >> ~/.gitconfig
echo "  path = ~/.config/git/.gitconfig" >> ~/.gitconfig

onConfigSourced gitconfig
#}}}

# Setup tmux {{{
echo "source-file \"~/.config/tmux/tmux.conf\"" >> ~/.tmux.conf

onConfigSourced tmux
#}}}

# vim: foldmethod=marker
