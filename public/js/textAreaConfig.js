const editorConfig = {
    display: 'block',
    width: '100%',
    height: 'auto',
    popupDisplay: 'full',
    charCounter: true,
    charCounterLabel: 'Characters :',
    buttonList: [
        // default
        ['save', 'undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['table', 'link', 'image'],
        ['fullScreen'],
        ['print'],
        
        // (min-width: 1546)
        ['%1546', [
            ['save', 'undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image'],
            ['fullScreen'],
            ['print']
        ]],
        // (min-width: 1455)
        ['%1455', [
            ['save', 'undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['table', 'link', 'image'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print']
        ]],
        // (min-width: 1326)
        ['%1326', [
            ['save', 'undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print'],
            ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image']
        ]],
        // (min-width: 1123)
        ['%1123', [
            ['save', 'undo', 'redo'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print'],
            ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image']
        ]],
        // (min-width: 817)
        ['%817', [
            ['save', 'undo', 'redo'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike'],
            [':t-More Text-default.more_text', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print'],
            ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image']
        ]],
        // (min-width: 673)
        ['%673', [
            ['save', 'undo', 'redo'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            [':r-More Rich-default.more_plus', 'table', 'link', 'image'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print']
        ]],
        // (min-width: 525)
        ['%525', [
            ['save', 'undo', 'redo'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            [':e-More Line-default.more_horizontal', 'align', 'horizontalRule', 'list', 'lineHeight'],
            [':r-More Rich-default.more_plus', 'table', 'link', 'image'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print']
        ]],
        // (min-width: 420)
        ['%420', [
            ['save', 'undo', 'redo'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            [':e-More Line-default.more_horizontal', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
            [':r-More Rich-default.more_plus', 'table', 'link', 'image'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print']
        ]]
    ],
    placeholder: 'Start typing something...',
}

const createEditorInstance = (id, config) => {
    const instance = SUNEDITOR.create(id, config);
    return instance;
};

