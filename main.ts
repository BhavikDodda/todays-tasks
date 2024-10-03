import { Plugin } from 'obsidian'

import { MyPluginSettings, DEFAULT_SETTINGS, SampleSettingTab } from "./settings"

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	filesData: any[];
	async onload() {
		await this.loadSettings();


		console.log("Bhavik's Plugin Loaded");
		
		console.log(this.filesData)
		this.app.workspace.on('active-leaf-change',async ()=>{
			const file = this.app.workspace.getActiveFile();
			if (file){
				if(file.path){
					if(file.path.includes("diary/All/")){
						const filesToModify0=this.filesData;
						console.log(filesToModify0)
						for(var j=0;j<filesToModify0.length;j++){
							const currRule = (filesToModify0)[j]
							const TasksDone=this.app.vault.getFileByPath(currRule.fil+".md");
							if(TasksDone){
							
								const content=await this.app.vault.read(TasksDone);
								const dateText=file.path.split('/').pop().replace('.md', '');

								var regg = new RegExp(currRule.fin)
								console.log(regg)
								
								var replaceby=currRule.repl.replace("${CURR_FILE_NAME}",dateText);
								var newcontent=content.replace(regg,replaceby);
								await this.app.vault.modify(TasksDone,newcontent);
								console.log("done updating the dataview in the Tasks done note");
							}
						}
					}
				}
			}
			
		})
		//
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}
	//
	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		console.log(this.settings)
		await sleep(2000);
		const rulesFile = this.app.vault.getFileByPath(this.settings.dataFile);
		let filesToModify: any[] = [];
		if (rulesFile){
			const rulesData = await this.app.vault.read(rulesFile);
			console.log(rulesData)
			window.astr = rulesData;
			const lii=rulesData.split("---");
			var regexrr=new RegExp('\\{ ?\\[\\[(.*?)\\]\\] ?\\}\\n\\{ ?f:(.*?) ?\\}\n\\{r: ?(.*)? ?\\}\\.')
			for(var i=0;i<lii.length;i++){
				const therule=lii[i];
				console.log(therule)
				var matches=therule.match(regexrr);
				if(matches){
					filesToModify.push({fil:matches[1],fin:matches[2],repl:matches[3]})
					
				}
			}
			this.filesData=filesToModify
		}
		
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	
}
