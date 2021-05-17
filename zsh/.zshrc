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

autoload -Uz compinit
compinit
# case insensitive completion
zstyle ':completion:*' matcher-list 'm:{[:lower:][:upper:]}={[:upper:][:lower:]}' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*' 'm:{[:lower:][:upper:]}={[:upper:][:lower:]} l:|=* r:|=*'
# expand /u/lo/b to /usr/local/bin
zstyle ':completion:*' list-suffixes zstyle ':completion:*' expand prefix suffix
# show the currently selected completion candidate
zstyle ':completion:*' menu select
zstyle ':completion:*' list-colors "${(@s.:.)LS_COLORS}"

source $ZDOTDIR/gitprompt.sh
GIT_PS1_SHOWDIRTYSTATE=1
GIT_PS1_SHOWSTASHSTATE=1
GIT_PS1_SHOWUPSTREAM="verbose"
GIT_PS1_SHOWCOLORHINTS=1
setopt prompt_subst
PROMPT='%F{magenta}%? %F{blue}%~%F{white} $(__git_ps1 "%s") \$ '
precmd () {
    print -Pn "\e]0;%1~\a"
}

bindkey -e
bindkey "[A" up-line-or-search
bindkey "[B" down-line-or-search
bindkey "^[[3~" delete-char

function fzy_history {
    # TODO fzy doesn't keep things chronological and doesn't have an option to do so
    LBUFFER="$LBUFFER$(history -r 0 | fzy | sed -E 's/^ +[0-9]+  (.*)/\1/')"
    zle reset-prompt
}
function fzy_path {
    LBUFFER="$LBUFFER$(fd . | fzy)"
    zle reset-prompt
}
zle -N fzy_history
zle -N fzy_path
bindkey '^R' fzy_history
bindkey '^T' fzy_path

autoload -U edit-command-line
zle -N edit-command-line
bindkey '^x^e' edit-command-line

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
        BUFFER=$BUFFER"jd "
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
bindkey 'jd ' fzy_jd
# a nicety so that executing just jd will mimic the behaviour of just executing
# cd, that is, change the pwd to $HOME
alias jd=cd

function - {
    cd -
}

export GOPATH=$HOME/go
export SSH_KEY_PATH="~/.ssh/id_rsa"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home"
# export JAVA_HOME="/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin":$PATH
export PATH="$HOME/bin":$PATH
export PATH="$PATH:/Users/rethy/Library/Application Support/Coursier/bin"
export PATH="$PATH:$HOME/flutter/flutter/bin"
export PATH="$PATH:$HOME/Downloads/apache-maven-3.6.3/bin/"
# export ANDROIDSDK="/Users/rethy/Library/Android/sdk"
# export ANDROIDNDK="/Users/rethy/Library/Android/sdk/ndk-bundle"
# export NDK="/Users/rethy/Library/Android/sdk/ndk-bundle"
# export FLUTTER="~/Programming/flutter"
# export ANDROID_HOME="/Users/rethy/Library/Android/sdk"
export GRADLE_COMPLETION_UNQUALIFIED_TASKS="true"
export ANDROID_HOME=~/Library/Android/sdk/
export PATH=/usr/local/bin:$PATH
export PATH="$HOME/.cargo/bin/":$PATH
export PATH="$HOME/.config/bin/":$PATH
export PATH=/usr/local/opt/openssl/bin:$PATH
export PATH=$GOPATH/bin/:$PATH
export PATH=/usr/local/go/bin:$PATH
export PATH=~/Library/Android/sdk/tools/bin/:$PATH
export PATH="/usr/local/Cellar/git/"$(ls /usr/local/Cellar/git/ | head -n 1)"/share/git-core/contrib/git-jump/:$PATH"
# export PATH=~/.rbenv/versions/2.6.3/bin:$PATH
export PATH=~/.rbenv/versions/2.7.1/bin:$PATH
export PATH=$HOME/Library/Python/3.7/bin:$PATH

export VISUAL='nvim'
export LANG=en_US.UTF-8
export EDITOR='nvim'
export MANPAGER="nvim -c 'set ft=man' -"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:/usr/local/opt/openssl/lib/pkgconfig:"
export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
--color=dark
--layout=reverse
'

alias src="source ~/.config/zsh/.zshrc"
alias esrc="v ~/.config/zsh/.zshrc -c 'cd %:p:h'"
alias v="nvim"
alias nrc="v ~/.config/nvim/init.lua -c 'cd ~/.config/nvim' -S"
alias python="python3"
alias PDFconcat="/System/Library/Automator/Combine\ PDF\ Pages.action/Contents/Resources/join.py -o"
alias todo="v ~/.todo/hometodo.md -c 'cd %:p:h'"
alias wc="rwc"
alias ls="gls --hyperlink=auto --color -p"
alias showpng="kitty +kitten icat"
alias ssh="kitty +kitten ssh"
alias vs="v -S"
alias bune="bundle"
alias myip="curl ipinfo.io;echo ''"
alias dk="eval \$(history -1 | sd '^[\s\d]+\s\s(.*)\$' '\$1')"

(tagrity revive &) &> /dev/null

eval "$(lua ~/lua/z.lua/z.lua --init zsh)"

export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/usr/local/opt/libxml2/lib/pkgconfig

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# load dev, but only if present and the shell is interactive
if [[ -f /opt/dev/dev.sh ]] && [[ $- == *i* ]]; then
    source /opt/dev/dev.sh
else
    if [ -x "$(command -v rbenv)" ]; then
        eval "$(rbenv init -)"
    fi
fi
eval $(opam env)

# source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
# Completion for kitty
# kitty + complete setup zsh | source /dev/stdin

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
# export SDKMAN_DIR="/Users/rethy/.sdkman"
# [[ -s "/Users/rethy/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/rethy/.sdkman/bin/sdkman-init.sh"

# vim: foldmethod=marker foldlevel=1
if [ -e /Users/adamp.regasz-rethy/.nix-profile/etc/profile.d/nix.sh ]; then . /Users/adamp.regasz-rethy/.nix-profile/etc/profile.d/nix.sh; fi # added by Nix installer
