import { Editor, Plugin } from 'obsidian'

export default class ExamplePlugin extends Plugin {
	async onload() {
		console.log("Bhavik's Plugin Loaded");
		this.app.workspace.on('active-leaf-change',async ()=>{
			const file = this.app.workspace.getActiveFile();
			if (file){
				console.log(file.path);
				if(file.path){
					if(file.path.includes("diary/All/")){
						const TasksDone=this.app.vault.getFileByPath("diary/Tasks done.md");
						if(TasksDone){
							const content=await this.app.vault.read(TasksDone);
							const dateText=file.path.split('/').pop().replace('.md', '');
							var newcontent=content.replace(/formatDateToToday\(\"[0-9a-zA-Z ]+\"\)\;/,`formatDateToToday("${dateText}");`);
							newcontent=newcontent.replace(/##### Done on [0-9a-zA-Z ]+\n/,`##### Done on ${dateText}\n`);
							await this.app.vault.modify(TasksDone,newcontent);
							console.log("done updating the dataview in the Tasks done note")
						}
					}
				}
			}
			
		})
		
	}
}