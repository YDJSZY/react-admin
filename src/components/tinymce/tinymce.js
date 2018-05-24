/**
 * Created by luwenwei on 18/5/2.
 */
import React from 'react';
import tinyMce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
//import 'tinymce/langs/zh_CN';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';

export default class TinymceComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    setTinyMce () {
        let { tinyMceId, content } = this.props;
        tinyMce.remove('#'+tinyMceId);/*进来先清除之前的编辑器*/
        tinyMce.init({
            mode: 'exact',
            elements: tinyMceId,
            relative_urls: true,
            height: 500,
            theme: 'modern',
            language: "zh_CN",
            preformatted: true,
            theme_advanced_source_editor_width: 600,
            init_instance_callback: (id, node) => { this.setTinymceContent(content, tinyMceId) },
            document_base_url: '../node_modules/',
            plugins: [
                'preview',
                'searchreplace wordcount code'
            ],/*配置插件*/
            toolbar1: 'undo redo outdent indent',
            toolbar2: 'searchreplace print preview media | forecolor backcolor emoticons | codesample code',/*配置操作栏*/
        });/*配置*/
    }

    setTinymceContent (content, tinyMceId) {
        tinyMce.get(tinyMceId).setContent(content);
    }

    getTinymceContent = () => {
        let tinyMceId = this.props.tinyMceId;
        let content = tinyMce.get(tinyMceId).getContent();
        return content;
    }

    componentWillReceiveProps (nextProps) {
        console.log(nextProps)
        if (this.props.content !== nextProps.content) {
            let tinyMceId = this.props.tinyMceId;
            tinyMce.get(tinyMceId).setContent(nextProps.content);
        }
    }

    componentDidMount () {
        this.setTinyMce();
    }
    
    render () {
        let { tinyMceId } = this.props;
        return (
            <textarea id={ tinyMceId } name={ tinyMceId } mce_editable="true" rows="10" cols="80"></textarea>
        )
    }
}