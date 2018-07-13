#!/bin/bash

# Setup ideavim {{{
echo "[Ideavim] Status: Started"

echo "source ~/.config/ideavimrc.vim" >> ~/.ideavimrc

echo "[Ideavim] Status: Finished!"
#}}}

# Setup gitconfig {{{
echo "[Gitconfig] Status: Started"

echo "[include]" >> ~/.gitconfig
echo "  path = ~/.config/git/.gitconfig" >> ~/.gitconfig

echo "[Gitconfig] Status: Finished!"
#}}}

# Setup tmux {{{
echo "[tmux] Status: Started"

source-file "~/.config/tmux/tmux.conf"

echo "[tmux] Status: Finished!"
#}}}


# vim: foldmethod=marker
