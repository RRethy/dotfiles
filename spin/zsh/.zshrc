#! /bin/sh

XDG_CONFIG_HOME=$HOME/.config
XDG_DATA_HOME=$HOME/.local/share

setopt no_auto_cd
setopt no_case_glob
setopt extended_history
setopt share_history
setopt append_history
setopt inc_append_history
setopt hist_ignore_dups
setopt hist_reduce_blanks
setopt hist_verify
setopt no_correct
setopt no_correct_all

HISTFILE=$XDG_DATA_HOME/.zsh_history
SAVEHIST=5000
HISTSIZE=5000

# enables completion
autoload -Uz compinit
compinit
# case insensitive completion
zstyle ':completion:*' matcher-list 'm:{[:lower:][:upper:]}={[:upper:][:lower:]}' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*'
# expand /u/lo/b to /usr/local/bin
zstyle ':completion:*' list-suffixes zstyle ':completion:*' expand prefix suffix
# show the currently selected completion candidate
zstyle ':completion:*' menu select
zstyle ':completion:*' list-colors "${(@s.:.)LS_COLORS}"

# git info for command prompt
source $XDG_CONFIG_HOME/zsh/gitprompt.sh
GIT_PS1_SHOWDIRTYSTATE=1
GIT_PS1_SHOWSTASHSTATE=1
GIT_PS1_SHOWUPSTREAM="verbose"
GIT_PS1_SHOWCOLORHINTS=1
setopt prompt_subst
PROMPT='%F{magenta}%? %F{blue}%~%F{white} $(__git_ps1 "%s") '
precmd () {
    print -Pn "\e]0;%1~\a"
}

# some readline movements
bindkey -e
bindkey "[A" up-line-or-search
bindkey "[B" down-line-or-search
bindkey "^[[3~" delete-char

# ^x^e to edit the current command line in $EDITOR
autoload -U edit-command-line
zle -N edit-command-line
bindkey '^x^e' edit-command-line

JUMPDIR_KEYBIND='jd '
# Setup some data a data file to store visited directories
mkdir -p "$XDG_DATA_HOME/zshrc"
JD_DATA_DIR="$XDG_DATA_HOME/zshrc/chpwd.txt"
touch $JD_DATA_DIR
local tmp=$(mktemp)
cat $JD_DATA_DIR | while read dir ; do [[ -d $dir ]] && echo $dir ; done > $tmp
cat $tmp > $JD_DATA_DIR
# Track visited directories
chpwd_functions+=(on_chpwd)
function on_chpwd {
    local tmp=$(mktemp)
    { echo $PWD ; cat $JD_DATA_DIR } | sort | uniq 1> $tmp
    cat $tmp > $JD_DATA_DIR
}
# zle widget function
function fzy_jd {
    # check if `jd ` was triggered in the middle of another command
    # e.g. $ aaaaaaajd 
    # If so, we manually input the `jd `
    if [[ ! -z $BUFFER ]]; then
        # Append `jd ` to the prompt
        BUFFER=$BUFFER$JUMPDIR_KEYBIND
        # move the cursor to the end of the line
        zle end-of-line
        return 0
    fi
    # ask the user to select a directory to jump to
    local dir=$({ echo $HOME ; cat $JD_DATA_DIR } | fzy)
    if [[ -z $dir ]]; then
        # no directory was selected, reset the prompt to what it was before
        zle reset-prompt
        return 0
    fi
    # Setup the command to change the directory
    BUFFER="cd $dir"
    # Accepts the cd we setup above
    zle accept-line
    local ret=$?
    # force the prompt to redraw to mimic what would occur with a normal cd
    zle reset-prompt
    return $ret
}
# define the new widget function
zle -N fzy_jd
# bind the widget function to `jd `
bindkey $JUMPDIR_KEYBIND fzy_jd
# a nicety so that executing just jd will mimic the behaviour of just executing
# cd, that is, change the pwd to $HOME
eval "alias $(echo $JUMPDIR_KEYBIND|xargs)=cd"

function - {
    cd - &> /dev/null
}

export SSH_KEY_PATH="~/.ssh/id_rsa"
export PATH=$XDG_CONFIG_HOME/bin/:$PATH
export PATH=$XDG_CONFIG_HOME/git/bin/git-jump:$PATH

export VISUAL='nvim'
export LANG=en_US.UTF-8
export EDITOR='nvim'
export MANPAGER="nvim -c 'set ft=man' -"

alias src="source ~/.config/zsh/.zshrc"
alias esrc="v ~/.config/zsh/.zshrc -c 'cd %:p:h'"
alias v="nvim"
alias nrc="v ~/.config/nvim/init.lua -c 'cd ~/.config/nvim' -S"
command -v rwc &> /dev/null && alias wc="rwc"
command -v gls &> /dev/null && alias ls="gls --hyperlink=auto --color -p"
alias vs="v -S"
alias bune="bundle"
alias myip="curl ipinfo.io;echo ''"

function fzy_path {
    LBUFFER="$LBUFFER$(fd . | fzy)"
    zle reset-prompt
}
zle -N fzy_path
bindkey '^T' fzy_path
