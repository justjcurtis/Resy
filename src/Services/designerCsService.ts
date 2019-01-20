import { readSetting } from "./localStorage";
import { readFileSync } from "fs";
import { ipcRenderer } from "electron";
import { PromptOptions } from "../models/promptOptions";
import { Datum } from "../models/resx";

function designerFoot() {
	var foot = `}
}`;
	return foot;
}
export function designerPath() {
	var desPath = null;
	var lf: string = readSetting("lastFile");
	if (lf !== undefined) {
		desPath = lf.slice(0, lf.length - 4) + "designer.cs";
	}
	return desPath;
}

function getDesignerNamespace() {
	var lf: string = readSetting("lastFile");
	if (lf !== undefined) {
		var filename = lf
			.split("\\")
			.pop()
			.split("/")
			.pop()
			.split(".")[0];
		var desPath = designerPath();
		if (designerPath !== null) {
			try {
				var desData = readFileSync("desPath").toString();
				if (desData !== undefined) {
					var namespacestart = desData.indexOf("namespace ") + 10;
					var namespaceend = desData.indexOf(" {");
					var namespace = desData.substring(
						namespacestart,
						namespaceend
					);
					return namespace;
				} else {
					return ipcRenderer.sendSync(
						"prompt",
						new PromptOptions(
							filename,
							"enter namespace for designer.cs generation",
							"",
							"Ok"
						)
					);
				}
			} catch (error) {
				return ipcRenderer.sendSync(
					"prompt",
					new PromptOptions(
						filename,
						"enter namespace for designer.cs generation",
						"",
						"Ok"
					)
				);
			}
		}
	}
}

function designerHead() {
	var lf: string = readSetting("lastFile");
	if (lf !== undefined) {
		var filename = lf
			.split("\\")
			.pop()
			.split("/")
			.pop()
			.split(".")[0];

		var head =
			`//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ` +
			getDesignerNamespace() +
			` {
	using System;
	
	
	/// <summary>
	///   A strongly-typed resource class, for looking up localized strings, etc.
	/// </summary>
	// This class was auto-generated by the StronglyTypedResourceBuilder
	// class via a tool like ResGen or Visual Studio.
	// To add or remove a member, edit your .ResX file then rerun ResGen
	// with the /str option, or rebuild your VS project.
	[global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "15.0.0.0")]
	[global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
	[global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
	public class ` +
			filename +
			` {
		
		private static global::System.Resources.ResourceManager resourceMan;
		
		private static global::System.Globalization.CultureInfo resourceCulture;
		
		[global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
		internal ` +
			filename +
			`		() {
		}

		/// <summary>
		///   Returns the cached ResourceManager instance used by this class.
		/// </summary>
		[global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
		public static global::System.Resources.ResourceManager ResourceManager {
			get {
				if (object.ReferenceEquals(resourceMan, null)) {
					global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Ideagen.Coruson.Mobile.Styles.StringLiterals", typeof(StringLiterals).Assembly);
					resourceMan = temp;
				}
				return resourceMan;
			}
		}

		/// <summary>
		///   Overrides the current thread's CurrentUICulture property for all
		///   resource lookups using this strongly typed resource class.
		/// </summary>
		[global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
		public static global::System.Globalization.CultureInfo Culture {
			get {
				return resourceCulture;
			}
			set {
				resourceCulture = value;
			}
		}`;
	}
	return head;
}

function rowEntry(name: string, value: string) {
	var row =
		`
		/// <summary>
		///   Looks up a localized string similar to ` +
		value +
		`
		/// </summary>
		public static string ` +
		name +
		`{
			get {
				return ResourceManager.GetString("` +
		name +
		`", resourceCulture);
			}
		}
	`;
	return row;
}
function designerBodyFromDatum(datum: Datum[]) {
	var result: string = "";
	datum.forEach(row => {
		result += rowEntry(row._attributes.name, row.value._text);
	});

	return result;
}

export function designerFromDatum(datum: Datum[]) {
	var head = designerHead();
	var body = designerBodyFromDatum(datum);
	var foot = designerFoot();

	console.log(head);
	console.log(body);
	console.log(foot);

	return head + body + foot;
}
