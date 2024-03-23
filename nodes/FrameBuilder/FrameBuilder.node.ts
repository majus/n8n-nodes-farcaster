// @ts-nocheck
import { JSDOM } from 'jsdom';
import { IExecuteFunctions } from 'n8n-core';
import { INodeType, INodeExecutionData, INodeTypeDescription } from 'n8n-workflow';

export class FrameBuilder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'FrameBuilder',
		name: 'frameBuilder',
		icon: 'file:FrameBuilder.svg',
		group: ['transform', 'output'],
		version: 1,
		description: 'Generates Framecaster HTML with meta tags for provided frame parameters',
		defaults: {
			name: 'Frame builder',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				required: true,
				default: '',
				description: 'URL of frame image',
			},
			{
				displayName: 'Buttons',
				name: 'buttons',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'items',
						displayName: 'Button N',
						values: [
							{
								displayName: 'Label',
								name: 'label',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Action',
								name: 'action',
								type: 'options',
								options: [
									{
										name: 'Link',
										value: 'link',
									},
									{
										name: 'Mint',
										value: 'mint',
									},
									{
										name: 'Post',
										value: 'post',
									},
									{
										name: 'Redirect',
										value: 'post_redirect',
									},
									{
										name: 'Transaction',
										value: 'tx',
									},
								],
								default: 'link',
								required: true,
								// description: 'Button action',
							},
							{
								displayName: 'Action Target',
								name: 'target',
								type: 'string',
								default: '',
								// description: 'Action target',
							},
							{
								displayName: 'Post URL',
								name: 'post_url',
								type: 'string',
								default: '',
								description: 'Custom Post URL',
							},
						],
					},
				],
				// description: '',
			},
			{
				displayName: 'Version',
				name: 'version',
				type: 'string',
				required: true,
				default: 'vNext',
				description: 'Version of the Frame',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Input',
						name: 'inputTextLabel',
						type: 'string',
						default: '',
						description: 'Text input label',
					},
					{
						displayName: 'Aspect Ratio',
						name: 'imageAspecRatio',
						type: 'options',
						options: [
							{
								name: '1.91:1',
								value: '1.91:1',
							},
							{
								name: '1:1',
								value: '1:1',
							},
						],
						default: '1.91:1',
						description: 'Image aspect ratio',
					},
					{
						displayName: 'Callback URL',
						name: 'postUrl',
						type: 'string',
						default: '',
						description: 'Signature Packet receiver endpoint URL',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'json',
						default: '{}',
						description: 'JSON representation of state passed to the frame server',
					},
					{
						displayName: 'HTML Template',
						name: 'template',
						type: 'string',
						typeOptions: {
							editor: 'htmlEditor',
						},
						default: '<!DOCTYPE html>\n<html>\n\t<head></head>\n\t<body></body>\n</html>',
						noDataExpression: true,
						description: 'HTML template to embed meta tags into',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			const image = this.getNodeParameter('image', i) as string;
			const buttons = this.getNodeParameter('buttons', i) as [any];
			const version = this.getNodeParameter('version', i) as string;
			const { inputTextLabel, imageAspectRatio, postUrl, state, template } = this.getNodeParameter(
				'additionalFields',
				i,
			) as IDataObject;
			const dom = new JSDOM(template);
			const document = dom.window.document;
			function addMetaTag(name: string, value: string) {
				const meta = document.createElement('meta');
				meta.name = name;
				meta.content = value;
				document.head.append(meta);
			}
			addMetaTag('fc:frame', version);
			addMetaTag('og:image', image);
			addMetaTag('fc:frame:image', image);
			addMetaTag('fc:frame:image:aspect_ratio', imageAspectRatio);
			if (postUrl) {
				addMetaTag('fc:frame:postUrl', postUrl);
			}
			if ('items' in buttons) {
				buttons.items.forEach((button, i) => {
					addMetaTag(`fc:frame:button:${i + 1}`, button.label);
					addMetaTag(`fc:frame:button:${i + 1}:action`, button.action);
					if (button.target) {
						addMetaTag(`fc:frame:button:${i + 1}:target`, button.target);
					}
					if (button.postUrl) {
						addMetaTag(`fc:frame:button:${i + 1}:post_url`, button.postUrl);
					}
				});
			}
			if (inputTextLabel) {
				addMetaTag('fc:frame:input:text', inputTextLabel);
			}
			if (state && state !== '{}') {
				addMetaTag('fc:frame:state', state);
			}
			const anOutput: INodeExecutionData = {
				json: {
					output: dom.serialize(),
				},
			};
			returnData.push(anOutput);
		}
		return [returnData];
	}
}
