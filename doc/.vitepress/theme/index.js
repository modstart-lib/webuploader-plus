// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import {watch} from 'vue'
import {inBrowser} from 'vitepress'

export default {
    extends: DefaultTheme,
    enhanceApp({router}) {
        // 仅在浏览器环境下执行
        if (!inBrowser) return

        // 监听路由路径变化
        watch(
            () => router.route.path,
            (path) => {
                if (window._hmt) {
                    // 手动触发百度统计的页面查看事件
                    // 注意：路径需要包含 base 前缀（如果有的话）
                    window._hmt.push(['_trackPageview', path]);
                    // console.log('百度统计已记录页面跳转：', path); // 调试用
                }
            }
        )
    }
}
