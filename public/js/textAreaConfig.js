let editorConfig = {
    display: 'block',
    width: '100%',
    height: '300',
    popupDisplay: 'full',
    charCounter: true,
    charCounterLabel: 'Characters :',
    fontSize : ['8', '10', '12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72', '96'],
    imageFileInput: false,
    buttonList: [
        // default
        ['save', 'undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
        ['paragraphStyle', 'blockquote'],
        ['align', 'outdent', 'indent', 'list', 'lineHeight'],
        ['horizontalRule', 'table', 'link', 'image'],
        ['fullScreen', 'codeView'],
        ['print'],

        // (min-width: 1546)
        ['%1546', [
            ['save', 'undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            ['paragraphStyle', 'blockquote'],
            ['align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['horizontalRule', 'table', 'link', 'image'],
            ['fullScreen', 'codeView'],
            ['print'],
        ]],
        // (min-width: 1455)
        ['%1455', [
            ['save', 'undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            ['paragraphStyle', 'blockquote'],
            ['align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['horizontalRule', 'table', 'link', 'image'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView']
        ]],
        // (min-width: 1326)
        ['%1326', [
            ['save', 'undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            ['paragraphStyle', 'blockquote'],
            ['align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView'],
            ['-right', ':r-More Rich-default.more_plus', 'horizontalRule', 'table', 'link', 'image']
        ]],
        // (min-width: 1123)
        ['%1125', [
            ['save', 'undo', 'redo'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            ['align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView'],
            ['-right', ':r-More Rich-default.more_plus', 'horizontalRule', 'table', 'link', 'image']
        ]],
        // (min-width: 817)
        ['%817', [
            ['save', 'undo', 'redo'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':e-More Line-default.more_horizontal', 'align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView'],
            ['-right', ':r-More Rich-default.more_plus', 'horizontalRule', 'table', 'link', 'image']
        ]],
        // (min-width: 673)
        ['%673', [
            ['save', 'undo', 'redo'],
            [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':e-More Line-default.more_horizontal', 'align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView'],
            ['-right', ':r-More Rich-default.more_plus', 'horizontalRule', 'table', 'link', 'image']
        ]],
        // (min-width: 525)
        ['%525', [
            ['save', 'undo', 'redo'],
            [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'textStyle', 'removeFormat'],
            ['fontColor', 'hiliteColor', ],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':e-More Line-default.more_horizontal', 'align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView'],
            ['-right', ':r-More Rich-default.more_plus', 'horizontalRule', 'table', 'link', 'image']
        ]],
        // (min-width: 420)
        ['%420', [
            ['save', 'undo', 'redo'],
            [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
            [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
            [':e-More Line-default.more_horizontal', 'align', 'outdent', 'indent', 'list', 'lineHeight'],
            ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'print', 'codeView'],
            ['-right', ':r-More Rich-default.more_plus', 'horizontalRule', 'table', 'link', 'image']
        ]]
    ],
    placeholder: 'Start typing something...',
    resizingBar: true,

}

const createEditorInstance = (id, config) => {
    const instance = SUNEDITOR.create(id, config);
    instance.onChange = (contents, core) => {
        instance.save();
    };
    return instance;
};

