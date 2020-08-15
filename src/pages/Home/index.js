import React, { useState, useEffect } from 'react';

import logo from '../../assets/logo.svg';
import * as S from './styles';

export default function Home() {
	const [templates, setTemplates] = useState([]);
	const [selectedTemplate, setselectedTemplate] = useState(null);

	/* uma função que executa 1x só */
	useEffect(() => {
		(async () => {
			const resp = await fetch('https://api.imgflip.com/get_memes');
			const {
				data: { memes },
			} = await resp.json();
			setTemplates(memes);
		})();
	}, []);

	return (
		<div>
			<S.Container>
				<img src={logo} alt="Mememaker" />
				<S.Card>
					<h2>Selecione um template</h2>
					<S.Templates>
						{templates.map((template) => (
							<button
								key={template.id}
								type="button"
								onClick={() => setselectedTemplate(template)}
								className={
									template.id === selectedTemplate?.id
										? 'selected'
										: ''
								}
							>
								<img src={template.url} alt={template.name} />
							</button>
						))}
					</S.Templates>
					<h2>Textos</h2>
					<S.Form>
						<input placeholder="Texto 1" />
						<input placeholder="Texto 1" />
						<input placeholder="Texto 1" />
						<S.Button>MakeMyMemer</S.Button>
					</S.Form>
				</S.Card>
			</S.Container>
		</div>
	);
}
