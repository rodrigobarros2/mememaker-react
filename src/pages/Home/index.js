import React, { useState, useEffect } from 'react';
import qs from 'qs';

import * as S from './styles';
import logo from '../../assets/logo.svg';

export default function Home() {
	const [templates, setTemplates] = useState([]);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [boxes, setBoxes] = useState([]);
	const [generatedMeme, setGeneratedMeme] = useState(null);

	useEffect(() => {
		(async () => {
			const resp = await fetch('https://api.imgflip.com/get_memes');
			const {
				data: { memes },
			} = await resp.json();
			setTemplates(memes);
		})();
	}, []);

	// currying -> função que retorna outra função
	const handleInputChange = (index) => (e) => {
		const newValues = boxes;
		newValues[index] = e.target.value;
		setBoxes(newValues);
	};

	function handleSelectTemplate(template) {
		setSelectedTemplate(template);
		setBoxes([]);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const params = qs.stringify({
			template_id: selectedTemplate.id,
			username: 'vikayel543',
			password: 'vikayel543',
			boxes: boxes.map((text) => ({ text })),
		});

		const resp = await fetch(
			`https://api.imgflip.com/caption_image?${params}`
		);
		const {
			data: { url },
		} = await resp.json();

		setGeneratedMeme(url);
	}

	function handleReset() {
		setSelectedTemplate(null);
		setBoxes([]);
		setGeneratedMeme(null);
	}

	return (
		<S.Container>
			<img src={logo} alt="MemeMaker" />

			<S.Card>
				{generatedMeme && (
					<>
						<img src={generatedMeme} alt="Generated Meme" />
						<S.Button type="button" onClick={handleReset}>
							Criar outro meme
						</S.Button>
					</>
				)}

				{!generatedMeme && (
					<>
						<h2>Selecione um template</h2>
						<S.Templates>
							{templates.map((template) => (
								<button
									key={template.id}
									type="button"
									onClick={() =>
										handleSelectTemplate(template)
									}
									className={
										template.id === selectedTemplate?.id
											? 'selected'
											: ''
									}
								>
									<img
										src={template.url}
										alt={template.name}
									/>
								</button>
							))}
						</S.Templates>

						{selectedTemplate && (
							<>
								<h2>Textos</h2>
								<S.Form onSubmit={handleSubmit}>
									{new Array(selectedTemplate.box_count)
										.fill('')
										.map((_, index) => (
											<input
												key={String(Math.random())}
												placeholder={`Text #${
													index + 1
												}`}
												onChange={handleInputChange(
													index
												)}
											/>
										))}

									<S.Button type="submit">
										MakeMyMeme!
									</S.Button>
								</S.Form>
							</>
						)}
					</>
				)}
			</S.Card>
		</S.Container>
	);
}
