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

maybeBrewProgram() {
  onInstallStarted $1

  which -s $1
  if [[ $? -ne 0 ]] ; then
    brew install $1
  else
    brew upgrade $1
  fi
}
#}}}

# Install Brew {{{
onInstallStarted Brew

which -s brew

if [[ $? -ne 0 ]] ; then
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  brew update
fi

onInstallFinished Brew
#}}}

# Install zsh {{{
maybeBrewProgram zsh

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

if [[ $? -ne 0 ]] ; then
  brew install coreutils
else
  brew upgrade coreutils
fi

onInstallFinished "coreutils for gshuf"
#}}}

# Install autojump {{{
maybeBrewProgram autojump
#}}}

# Install w3m {{{
maybeBrewProgram w3m
#}}}

# Install ranger {{{
maybeBrewProgram ranger
#}}}

# Install fzf {{{
onInstallStarted fzf
brew install fzf
$(brew --prefix)/opt/fzf/install
#}}}

# Download OnThisDay facts {{{
if [[ ! -d $HOME/.config/wikidates ]] ; then
  for day in {1..365}; do
    mkdir ~/.config/wikidates 2>/dev/null
    date=$(gdate -d "now + $day days" +%B_%d)
    w3m -cols 99999 -dump http://en.wikipedia.org/wiki/$date | sed -n '/Events.*edit/,/Births/ p' | sed -n 's/^.*• //p' > ~/.config/wikidates/$date
    echo "Found facts for day: $day of the year!"
  done
  w3m -cols 99999 -dump http://en.wikipedia.org/wiki/february_29 | sed -n '/Events.*edit/,/Births/ p' | sed -n 's/^.*• //p' > ~/.config/wikidates/February_29
fi
#}}}

# Setup zsh {{{
echo "source $HOME/.config/zsh/zshrc.zsh" >> ~/.zshrc

onConfigSourced zsh
#}}}

# Setup ideavim {{{
echo "source $HOME/.config/ideavimrc.vim" >> ~/.ideavimrc

onConfigSourced ideavimrc
#}}}

# Setup gitconfig {{{
echo "[include]" >> ~/.gitconfig
echo "  path = $HOME/.config/git/.gitconfig" >> ~/.gitconfig

onConfigSourced gitconfig
#}}}

# Setup tmux {{{
echo "source-file \"$HOME/.config/tmux/tmux.conf\"" >> ~/.tmux.conf

onConfigSourced tmux
#}}}

# Download vim-plug {{{
curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
#}}}

# vim: foldmethod=marker foldlevel=1
