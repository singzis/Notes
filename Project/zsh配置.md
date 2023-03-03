on my zsh安装
theme安装 [Spaceship](https://spaceship-prompt.sh/zh/)
代码高亮提示
```shell
cd "$ZSH_CUSTOM/plugins"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git
git clone https://github.com/zsh-users/zsh-autosuggestions.git
```
修改.zshrc
```
vi ~/.zshrc
```
配置增加
```
plugins = (git zsh-autosuggestions zsh-syntax-highlighting)
```
重启
```
source ~/.zshrc
```
