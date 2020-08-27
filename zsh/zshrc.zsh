# Styling{{{
POWERLEVEL9K_MODE="nerdfont-complete"
ZSH_THEME="powerlevel9k/powerlevel9k"

POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(custom_user dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=()

POWERLEVEL9K_PROMPT_ON_NEWLINE=true

POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=""
POWERLEVEL9K_MULTILINE_SECOND_PROMPT_PREFIX=$' \uf105  ' # Nice little arrow

# POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR=$'\ue0b4 ' # Rounded seperator
POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR=$'\ue0b0 ' # Triangle seperator

POWERLEVEL9K_CUSTOM_ICE_CREAM="cool_ice_cream"
POWERLEVEL9K_CUSTOM_ICE_CREAM_FOREGROUND="blue"
POWERLEVEL9K_CUSTOM_ICE_CREAM_BACKGROUND="white"

POWERLEVEL9K_CUSTOM_USER="whoami"
POWERLEVEL9K_CUSTOM_USER_FOREGROUND="012"
POWERLEVEL9K_CUSTOM_USER_BACKGROUND="white"

POWERLEVEL9K_DIR_HOME_FOREGROUND="white"
POWERLEVEL9K_DIR_HOME_BACKGROUND="012"
POWERLEVEL9K_DIR_DEFAULT_FOREGROUND="white"
POWERLEVEL9K_DIR_DEFAULT_BACKGROUND="012"
POWERLEVEL9K_DIR_HOME_SUBFOLDER_FOREGROUND="white"
POWERLEVEL9K_DIR_HOME_SUBFOLDER_BACKGROUND="012"

POWERLEVEL9K_VCS_CLEAN_FOREGROUND='black'
POWERLEVEL9K_VCS_CLEAN_BACKGROUND='green'
POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND='012'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='red'
POWERLEVEL9K_VCS_MODIFIED_FOREGROUND='012'
POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='yellow'

CASE_SENSITIVE="false"
HYPHEN_INSENSITIVE="true"
# ENABLE_CORRECTION="true"
#DISABLE_UNTRACKED_FILES_DIRTY="true"
HIST_STAMPS="dd/mm/yyyy"
plugins=(git brew common-aliases gitfast git-extras sudo)
DISABLE_CORRECTION="true"
unsetopt correct_all
unsetopt correct
# }}}

# Functions{{{

prompt_user() {
  echo -n $(whoami)
}

cool_ice_cream() {
  echo -n "\ue70e "
}

formatted_time() {
  echo -n "\uf252 $(date +%r)"
}

prompt_zsh_showStatus_spotify () {
  local color='%F{white}'
  state=`osascript -e 'tell application "Spotify" to player state as string'`;
  if [ $state = "playing" ]; then
    artist=`osascript -e 'tell application "Spotify" to artist of current track as string'`;
    track=`osascript -e 'tell application "Spotify" to name of current track as string'`;

    echo -n "%{$color%} $artist - $track " ;
  fi
}

function code {
  if [[ $# = 0 ]]; then
    open -a "Visual Studio Code"
  else
    local argPath="$1"
    [[ $1 = /* ]] && argPath="$1" || argPath="$PWD/${1#./}"
    open -a "Visual Studio Code" "$argPath"
  fi
}

function updateOnThisDay {
  for day in {1..365}; do
    mkdir ~/.config/wikidates 2>/dev/null
    date=$(gdate -d "now + $day days" +%B_%d)
    w3m -cols 99999 -dump http://en.wikipedia.org/wiki/$date | sed -n '/Events.*edit/,/Births/ p' | sed -n 's/^.*• //p' > ~/.config/wikidates/$date
    echo "Found facts for day: $day of the year!"
  done
  w3m -cols 99999 -dump http://en.wikipedia.org/wiki/february_29 | sed -n '/Events.*edit/,/Births/ p' | sed -n 's/^.*• //p' > ~/.config/wikidates/February_29
}

# fbr - checkout git branch
fbr() {
  local branches branch
  branches=$(git branch) &&
  branch=$(echo "$branches" | fzf-tmux -d 15 +m) &&
  git checkout $(echo "$branch" | sed "s/.* //")
}

# fcommits - git commit browser
fcommits() {
  git log --graph --color=always \
    --format="%C(auto)%h%d %s %C(black)%C(bold)%cr" "$@" |
    fzf --ansi --no-sort --reverse --tiebreak=index --bind=ctrl-s:toggle-sort \
    --bind "ctrl-m:execute:
  (grep -o '[a-f0-9]\{7\}' | head -1 |
    xargs -I % sh -c 'git show --color=always % | less -R') << 'FZF-EOF'
  {}
  FZF-EOF"
}

function maybeShowTodo() {
  if [ -e ~/.todo/hometodo.md ]; then
    cat ~/.todo/hometodo.md
  fi
}

function updateGitIgnore() {
  git rm -r --cached .
  git add .
  git commit -m ".gitignore fix"
}

# }}}

# variable{{{
# export ARCHFLAGS="-arch x86_64"

# alias ls='ls --color'
# LS_COLORS=$LS_COLORS:'di=1;32:'
# export LS_COLORS

export GOPATH=$HOME/go
export SSH_KEY_PATH="~/.ssh/id_rsa"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home"
# export ANDROIDSDK="/Users/rethy/Library/Android/sdk"
# export ANDROIDNDK="/Users/rethy/Library/Android/sdk/ndk-bundle"
# export NDK="/Users/rethy/Library/Android/sdk/ndk-bundle"
# export FLUTTER="~/Programming/flutter"
# export ANDROID_HOME="/Users/rethy/Library/Android/sdk"
export GRADLE_COMPLETION_UNQUALIFIED_TASKS="true"
export ANDROID_HOME=~/Library/Android/sdk/
export PATH="$JAVA_HOME/bin":$PATH
export PATH=/usr/local/bin:$PATH
export PATH="$HOME/.cargo/bin/":$PATH
export PATH="$HOME/.config/bin/":$PATH
export PATH=/usr/local/opt/openssl/bin:$PATH
export PATH=$GOPATH/bin/:$PATH
export PATH=~/Library/Android/sdk/tools/bin/:$PATH
export PATH="/usr/local/Cellar/git/"$(ls /usr/local/Cellar/git/ | head -n 1)"/share/git-core/contrib/git-jump/:$PATH"
# export PATH=~/.rbenv/versions/2.6.3/bin:$PATH
export PATH=~/.rbenv/versions/2.7.1/bin:$PATH


# export VISUAL='nvim'
export VISUAL='nvim'
export LANG=en_US.UTF-8
export TERM="xterm-256color"
export ZSH=~/.oh-my-zsh
source $ZSH/oh-my-zsh.sh
export EDITOR='nvim'
# export EDITOR='nvim'
export MANPAGER="nvim -c 'set ft=man' -"
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:/usr/local/opt/openssl/lib/pkgconfig:"
export PGDATA=/usr/local/var/postgres/
export FZF_DEFAULT_OPTS=$FZF_DEFAULT_OPTS'
--color=dark
--color=fg:-1,bg:-1,hl:#c678dd,fg+:#ffffff,bg+:#4b5263,hl+:#d858fe
--color=info:#98c379,prompt:#61afef,pointer:#be5046,marker:#e5c07b,spinner:#61afef,header:#61afef
--layout=reverse
'
# }}}

# aliases{{{
alias lsa="ls -a"
alias vm="nvim -c 'h help.txt|only'"
alias vimhelp="nvim -c 'h help.txt|only'"
alias nvm="nvim -c 'h vim_diff.txt|only'"
alias ds="/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"
alias now="date +%d-%m-%y"
# alias v="nvim"
alias v="nvim"
# alias vim="nvim"
alias nrc="v ~/.config/nvim/init.vim -c 'cd ~/.config/nvim' -S"
# alias h="cd ~"
alias python="python3"
alias PDFconcat="/System/Library/Automator/Combine\ PDF\ Pages.action/Contents/Resources/join.py -o"
alias todo="v ~/.todo/hometodo.md -c 'cd %:p:h'"
alias words="v ~/.todo/words.md -c 'cd %:p:h'"
alias src="source ~/.zshrc"
alias esrc="v ~/.config/zsh/zshrc.zsh -c 'cd %:p:h'"
alias startcleanstatusbar="adb shell settings put global sysui_demo_allowed 1"
alias cleanstatusbar="adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1200 | adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype false | adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false | adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100"
alias endcleanstatusbar="adb shell am broadcast -a com.android.systemui.demo -e command exit"
alias gra="gradle"
alias t="tmux"
alias tnh="tmux new -s maestro"
alias trc="vim ~/.config/tmux_conf/tmux.conf"
alias d="kitty +kitten diff"
alias gd="git difftool --no-symlinks --dir-diff"
alias showpng="kitty +kitten icat"
alias sshto="kitty +kitten ssh"
alias g++14="g++ -std=c++14"
alias vs="v -S"
alias bune="bundle"
alias myip="curl ipinfo.io"
# }}}

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# maybeShowTodo

# echo '\n'

# cat ~/.config/wikidates/$(date +%B_%d) | gshuf -n 1

source $HOME/ruby/jumpdir/jumpdir.zsh

export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/usr/local/opt/libxml2/lib/pkgconfig

# load dev, but only if present and the shell is interactive
if [[ -f /opt/dev/dev.sh ]] && [[ $- == *i* ]]; then
    source /opt/dev/dev.sh
else
    eval "$(rbenv init -)"
fi
eval $(opam env)

source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
autoload -Uz compinit
compinit
# Completion for kitty
kitty + complete setup zsh | source /dev/stdin

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
# export SDKMAN_DIR="/Users/rethy/.sdkman"
# [[ -s "/Users/rethy/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/rethy/.sdkman/bin/sdkman-init.sh"

# vim: foldmethod=marker foldlevel=1
