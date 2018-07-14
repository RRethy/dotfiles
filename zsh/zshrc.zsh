# Styling{{{
POWERLEVEL9K_MODE="nerdfont-complete"
ZSH_THEME="powerlevel9k/powerlevel9k"

POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(custom_ice_cream dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=()

POWERLEVEL9K_PROMPT_ON_NEWLINE=true

POWERLEVEL9K_MULTILINE_FIRST_PROMPT_PREFIX=""
POWERLEVEL9K_MULTILINE_SECOND_PROMPT_PREFIX=$' \uf105  ' # Nice little arrow

# POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR=$'\ue0b4 ' # Rounded seperator
POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR=$'\ue0b0 ' # Triangle seperator

POWERLEVEL9K_CUSTOM_ICE_CREAM="cool_ice_cream"
POWERLEVEL9K_CUSTOM_ICE_CREAM_FOREGROUND="white"
POWERLEVEL9K_CUSTOM_ICE_CREAM_BACKGROUND="238" # Light gray

POWERLEVEL9K_DIR_HOME_FOREGROUND="white"
POWERLEVEL9K_DIR_HOME_BACKGROUND="237" # Similar gray to my tmux status bar but a bit darker than the gray above
POWERLEVEL9K_DIR_DEFAULT_FOREGROUND="white"
POWERLEVEL9K_DIR_DEFAULT_BACKGROUND="237"
POWERLEVEL9K_DIR_HOME_SUBFOLDER_FOREGROUND="white"
POWERLEVEL9K_DIR_HOME_SUBFOLDER_BACKGROUND="237"

POWERLEVEL9K_VCS_CLEAN_FOREGROUND='black'
POWERLEVEL9K_VCS_CLEAN_BACKGROUND='green'
POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND='black'
POWERLEVEL9K_VCS_UNTRACKED_BACKGROUND='red'
POWERLEVEL9K_VCS_MODIFIED_FOREGROUND='black'
POWERLEVEL9K_VCS_MODIFIED_BACKGROUND='yellow'

CASE_SENSITIVE="false"
HYPHEN_INSENSITIVE="true"
ENABLE_CORRECTION="true"
#DISABLE_UNTRACKED_FILES_DIRTY="true"
HIST_STAMPS="dd/mm/yyyy"
plugins=(git autojump brew common-aliases gitfast git-extras sudo)
DISABLE_CORRECTION="true"
# }}}

# Functions{{{

cool_ice_cream() {
  echo -n "\ue70e "
}

formatted_time() {
  echo -n "\uf252 $(date +%r)"
}

spotify_info() {
  #echo -n $(spotify status | ag "Artist|Album")
  echo "$(spotify status)"
}

zsh_internet_signal(){
  #source on quality levels - http://www.wireless-nets.com/resources/tutorials/define_SNR_values.html
  #source on signal levels  - http://www.speedguide.net/faq/how-to-read-rssisignal-and-snrnoise-ratings-440
  local signal=$(airport -I | grep agrCtlRSSI | awk '{print $2}' | sed 's/-//g')
  local noise=$(airport -I | grep agrCtlNoise | awk '{print $2}' | sed 's/-//g')
  local SNR=$(bc <<<"scale=2; $signal / $noise")
  local net=$(curl -D- -o /dev/null -s http://www.google.com | grep HTTP/1.1 | awk '{print $2}')
  local color='%F{yellow}'
  local symbol="\uf197"
  local message="No Signal"

  # Excellent Signal (5 bars)
  if [[ ! -z "${signal// }" ]] && [[ $SNR -gt .40 ]] ;
  then color='%F{green}' ; symbol="\uf1eb" ; message="Strong" ;
  fi

  # Good Signal (3-4 bars)
  if [[ ! -z "${signal// }" ]] && [[ ! $SNR -gt .40 ]] && [[ $SNR -gt .25 ]] ;
  then color='%F{blue}' ; symbol="\uf1eb" ; message="Good" ;
  fi

  # Low Signal (2 bars)
  if [[ ! -z "${signal// }" ]] && [[ ! $SNR -gt .25 ]] && [[ $SNR -gt .15 ]] ;
  then color='%F{yellow}' ; symbol="\uf1eb" ; message="Low" ;
  fi

  # Very Low Signal (1 bar)
  if [[ ! -z "${signal// }" ]] && [[ ! $SNR -gt .15 ]] && [[ $SNR -gt .10 ]] ;
  then color='%F{red}' ; symbol="\uf1eb" ; message="Very Low" ;
  fi

  # No Signal - No Internet
  if [[ ! -z "${signal// }" ]] && [[ ! $SNR -gt .10 ]] ;
  then color='%F{red}' ; symbol="\uf011"; message="No Signal" ;
  fi

  # This has been fucking up and needs to be fixed
  # Internet is off I think
  if [[ -z "${signal// }" ]] && [[ "$net" -ne 200 ]] ;
  then color='%F{red}' ; symbol="\uf011" ; message="No Signal";
  fi

  # Ethernet Connection (no wifi, hardline)
  if [[ -z "${signal// }" ]] && [[ "$net" -eq 200 ]] ;
  then color='%F{blue}' ; symbol="\uf197" ; message="Ethernet" ;
  fi

  echo -n "%{$color%}$symbol " # \f1eb is wifi bars
  #echo -n "%{$color%} $message"
  #echo -n "%{$color%}$message"
}

prompt_zsh_showStatus_spotify () {
  local color='%F{white}'
  state=`osascript -e 'tell application "Spotify" to player state as string'`;
  if [ $state = "playing" ]; then
    artist=`osascript -e 'tell application "Spotify" to artist of current track as string'`;
    track=`osascript -e 'tell application "Spotify" to name of current track as string'`;

    echo -n "%{$color%} $artist - $track " ;
    #echo -n "$artist - $track";

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
  if [ -e ~/.todo/todo.md ]; then
    cat ~/.todo/todo.md
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

# export PATH=$ANDROIDNDK:$ANDROIDSDK/platform-tools:$ANDROIDSDK/tools:$PATH:$JAVA_HOME/bin
export PATH=$JAVA_HOME/bin:$PATH
#export PATH=$ANDROIDNDK:$ANDROIDSDK/platform-tools:$ANDROIDSDK/tools:$PATH
export PATH=$FLUTTER/bin:$PATH
export PATH=$HOME/bin:/usr/local/bin:$PATH
export PATH=$HOME/.cargo/bin/:$PATH
export PATH="$PATH":"~/.pub-cache/bin"
export PATH="$PATH:~/depot_tools"
export SSH_KEY_PATH="~/.ssh/id_rsa"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home"
# export ANDROIDSDK="/Users/rethy/Library/Android/sdk"
# export ANDROIDNDK="/Users/rethy/Library/Android/sdk/ndk-bundle"
# export NDK="/Users/rethy/Library/Android/sdk/ndk-bundle"
export FLUTTER="~/Programming/flutter"
# export ANDROID_HOME="/Users/rethy/Library/Android/sdk"
export GRADLE_COMPLETION_UNQUALIFIED_TASKS="true"

export LANG=en_US.UTF-8
export TERM="xterm-256color"
export ZSH=~/.oh-my-zsh
source $ZSH/oh-my-zsh.sh
export EDITOR='nvim'
export MANPAGER="nvim -c 'set ft=man' -"
# }}}

# aliases{{{
alias lsa="ls -a"
alias vm="nvim -c 'h help.txt|only'"
alias vimhelp="nvim -c 'h help.txt|only'"
alias nvm="nvim -c 'h vim_diff.txt|only'"
alias ds="/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME"
alias now="date +%d-%m-%y"
alias v="nvim"
alias vim="nvim"
alias nrc="nvim ~/.config/nvim/init.vim -c 'cd ~/.config/nvim'"
alias h="cd ~"
alias python="python3"
alias PDFconcat="/System/Library/Automator/Combine\ PDF\ Pages.action/Contents/Resources/join.py -o"
alias todo="nvim ~/.todo/todo.md -c 'cd %:p:h'"
alias src="source ~/.zshrc"
alias esrc="vim ~/.config/zsh/zshrc.zsh -c 'cd %:p:h'"
alias startcleanstatusbar="adb shell settings put global sysui_demo_allowed 1"
alias cleanstatusbar="adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1200 | adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype false | adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false | adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100"
alias endcleanstatusbar="adb shell am broadcast -a com.android.systemui.demo -e command exit"
alias gra="gradle"
alias t="tmux"
alias tnh="tmux new -s home"
alias trc="vim ~/.config/tmux_conf/tmux.conf"
alias d="kitty +kitten diff"
alias gd="git difftool --no-symlinks --dir-diff"
alias showpng="kitty +kitten icat"
alias sshto="kitty +kitten ssh"
alias showTodo="cat ~/.todo/todo.md"
# }}}

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

maybeShowTodo

echo '\n'

cat ~/.config/wikidates/$(date +%B_%d) | gshuf -n 1 # Prints out a cool daily fact

# vim: foldmethod=marker foldlevel=1
