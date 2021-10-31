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

if command -v kitty &> /dev/null ; then
    # set the terminal window's colors based on the current base16 theme
    eval "kitty @ set-colors -c $HOME/base16-kitty/colors/$(cat $XDG_CONFIG_HOME/.base16_theme).conf"
    # keybinding to change my terminal colors with fzy
    COLORS_KEYBIND=' c'
    function fzy_colors {
        if [[ ! -z $BUFFER ]]; then
            BUFFER="$BUFFER c"
            zle end-of-line
            return 0
        fi
        local color=$(gls --color=never $HOME/base16-kitty/colors/ | grep -v "256"| fzy)
        if [[ -z $color ]]; then
            zle reset-prompt
            return 0
        fi
        BUFFER="kitty @ set-colors -c $HOME/base16-kitty/colors/$color"
        echo $(echo $color | cut -f 1 -d '.') > $XDG_CONFIG_HOME/.base16_theme
        zle accept-line
        local ret=$?
        zle reset-prompt
        return $ret
    }
    zle -N fzy_colors
    bindkey ' c' fzy_colors

    alias showpng="kitty +kitten icat"
    alias ssh="kitty +kitten ssh"
fi

function - {
    cd - &> /dev/null
}

export GOPATH=$HOME/go
export SSH_KEY_PATH="~/.ssh/id_rsa"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home"
export GRADLE_COMPLETION_UNQUALIFIED_TASKS="true"
export ANDROID_HOME=~/Library/Android/sdk/
export PATH="$JAVA_HOME/bin":$PATH
export PATH="$HOME/bin":$PATH
export PATH="$PATH:/Users/rethy/Library/Application Support/Coursier/bin"
export PATH="$PATH:$HOME/flutter/flutter/bin"
export PATH="$PATH:$HOME/Downloads/apache-maven-3.6.3/bin/"
export PATH=/usr/local/bin:$PATH
export PATH=$HOME/.cargo/bin/:$PATH
export PATH=$HOME/.config/bin/:$PATH
export PATH=/usr/local/opt/openssl/bin:$PATH
export PATH=$GOPATH/bin/:$PATH
export PATH=/usr/local/go/bin:$PATH
export PATH=~/Library/Android/sdk/tools/bin/:$PATH
export PATH=$XDG_CONFIG_HOME/git/bin:$PATH
export PATH=~/.rbenv/versions/2.7.1/bin:$PATH
export PATH=$HOME/Library/Python/3.7/bin:$PATH
export PATH=$HOME/src/github.com/Shopify/runtime/dev_exe:$PATH

export VISUAL='nvim'
export LANG=en_US.UTF-8
export EDITOR='nvim'
export MANPAGER="nvim -c 'set ft=man' -"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:/usr/local/opt/openssl/lib/pkgconfig:"
export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
--color=dark
--layout=reverse
'

[[ -r $HOME/.cargo/env ]] && source $HOME/.cargo/env

alias src="source ~/.config/zsh/.zshrc"
alias esrc="v ~/.config/zsh/.zshrc -c 'cd %:p:h'"
alias v="nvim"
alias nrc="v ~/.config/nvim/init.lua -c 'cd ~/.config/nvim' -S"
alias python="python3"
[[ "$OSTYPE" == "darwin"* ]] && alias PDFconcat="/System/Library/Automator/Combine\ PDF\ Pages.action/Contents/Resources/join.py -o"
alias todo="v ~/.todo/hometodo.md -c 'cd %:p:h'"
command -v rwc &> /dev/null && alias wc="rwc"
command -v gls &> /dev/null && alias ls="gls --hyperlink=auto --color -p"
alias vs="v -S"
alias bune="bundle"
alias myip="curl ipinfo.io;echo ''"
alias dk="eval \$(history -1 | sd '^[\s\d]+\s\s(.*)\$' '\$1')"
if [[ -x $HOME/lua/lua-language-server/3rd/luamake/luamake ]]; then
    alias luamake=/Users/adam.regaszrethy/lua/lua-language-server/3rd/luamake/luamake
fi

command -v tagrity &> /dev/null && (tagrity revive &) &> /dev/null

export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/usr/local/opt/libxml2/lib/pkgconfig

[[ -f ~/.fzf.zsh ]] && source ~/.fzf.zsh

function fzy_path {
    LBUFFER="$LBUFFER$(fd . | fzy)"
    zle reset-prompt
}
zle -N fzy_path
bindkey '^T' fzy_path

[[ -f /opt/dev/dev.sh ]] && source /opt/dev/dev.sh
[[ -e /Users/adam.regaszrethy/.nix-profile/etc/profile.d/nix.sh ]] && . /Users/adam.regaszrethy/.nix-profile/etc/profile.d/nix.sh

# cloudplatform: add Shopify clusters to your local kubernetes config
export KUBECONFIG=${KUBECONFIG:+$KUBECONFIG:}$HOME/.kube/config:/Users/adam.regaszrethy/.kube/config.shopify.cloudplatform
export KUBECONFIG=$KUBECONFIG:~/.kube/config.shopify.production-registry
if [[ -d $HOME/src/github.com/Shopify/cloudplatform/workflow-utils ]]; then
    for file in $HOME/src/github.com/Shopify/cloudplatform/workflow-utils/*.bash; do
        source ${file};
    done
fi
command -v kubectl-short-aliases &> /dev/null && kubectl-short-aliases

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/adam.regaszrethy/Downloads/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/adam.regaszrethy/Downloads/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/adam.regaszrethy/Downloads/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/adam.regaszrethy/Downloads/google-cloud-sdk/completion.zsh.inc'; fi
