/**
 * External dependencies
 */
import styled from '@emotion/styled';
import { css } from '@emotion/react';

/**
 * Internal dependencies
 */
import { space } from '../ui/utils/space';

type TokensAndInputWrapperProps = {
	__next36pxDefaultSize: boolean;
	hasTokens: boolean;
};

const deprecatedPaddings = ( {
	__next36pxDefaultSize,
}: TokensAndInputWrapperProps ) =>
	! __next36pxDefaultSize &&
	css`
		padding: ${ space( 0.5 ) } ${ space( 1 ) };
	`;

const hasTokenPaddings = ( { hasTokens }: TokensAndInputWrapperProps ) =>
	hasTokens &&
	css`
		padding: 3px 5px;
	`;

export const TokensAndInputWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 5px ${ space( 1 ) };

	${ hasTokenPaddings }

	${ deprecatedPaddings }
`;
