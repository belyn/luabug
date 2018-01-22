import { TemplateManager } from '../Template/TemplateManager';
import { ExtensionManager } from '../ExtensionManager';
import * as vscode from "vscode"
var fs = require('fs');
var os = require('os');
var path = require('path');
/**
 * 创建模板文件
 */
export class CreateTemplateFile {
    public static run(e) {

        var templateManager: TemplateManager = ExtensionManager.em.templateManager

        var templates: Array<string> = templateManager.getTemplates()

        if (templates != null) {
            if (templates.length > 0) {
                vscode.window.showQuickPick(templates).then(function (selection) {
                    // nothing selected. cancel
                    if (!selection) {
                        return;
                    }

                    CreateTemplateFile.showInputBox(templateManager, selection,e)
                });

            } else {
                vscode.window.showInformationMessage("没有模板文件!")
            }
        }


    }
    public static showInputBox(templateManager, selection,e) {
        // ask for filename
        var inputOptions = {
            prompt: "请输入文件名",
            value: selection,
        };
        vscode.window.showInputBox(inputOptions).then(function (filename) {
            if (filename == "") {
                CreateTemplateFile.showInputBox(templateManager, selection,e)
                return
            } else {
                var fileContents = templateManager.getTemplate(selection);
               var templateFile = ""
                if(e != null && e.fsPath != null){
                     templateFile = e.fsPath
                }else
                {
                         //找到需要创建文件的路径
                    var editor: vscode.TextEditor = vscode.window.activeTextEditor;

                    templateFile = path.dirname(path)
                   
                }
                //判断有没有.lua 后缀 如果没有添加
                var lastIndex: number = filename.lastIndexOf(".lua")
                if (lastIndex != filename.length - 4) {
                    filename += ".lua";
                }
                var moduleName = filename.substring(0, filename.length - 4)
                fileContents = fileContents.replace("${moduleName}", moduleName)
                fileContents = ExtensionManager.em.luaIdeConfigManager.replaceConfigValue(fileContents, moduleName)
                fs.writeFile(path.join(templateFile, filename), fileContents, function (err) {
                    if (err) {
                        vscode.window.showErrorMessage(err.message);
                    }
                    vscode.window.showInformationMessage(filename + " created");
                });
            }

        });

    }

}